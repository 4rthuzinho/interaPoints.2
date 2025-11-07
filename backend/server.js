import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bcrypt from "bcryptjs";
import { atualizarPontuacao } from './services/pontuacaoService.js'
import { gerarToken, verificarToken, permitirRoles } from "./middleware/auth.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API de Tarefas no ar!');
});

// Rota para buscar tarefas
app.get('/tarefas', async (req, res) => {
  try {
    const todasTarefas = await prisma.tarefa.findMany();
    if(todasTarefas.length === 0){
      return res.status(404).json({ message: "Nenhuma tarefa encontrada" });
    }

    res.status(200).json(todasTarefas);
    console.log("Get Tarefas:", todasTarefas);
  }catch(error) {
    console.error(error);
    res.status(500).json({error: 'Erro ao bsucar tarefas.'})
  }
});

// Rota para criar tarefa
app.post('/tarefas', async (req, res) => {
  const { titulo, descricao } = req.body;

  if (!titulo || !descricao) {
    return res.status(400).json({ error: 'Título e descrição são obrigatórios.' });
  }

  try {
    const tarefa = await prisma.tarefa.create({
      data: {
        titulo,
        descricao
      }
    });

    res.status(201).json(tarefa);
    console.log("Tarefa criada:", tarefa.titulo)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
});

// Rota para concluir uma tarefa com avaliação
app.put('/tarefaOk', async (req, res) => {
  const { id, rating, feedback, userId } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Necessário passar o ID.' });
  }
  if (!userId) {
    console.log("userId:", userId);
    return res.status(400).json({ error: 'User ID não encontrado.' });
  }

  try {
    const tarefaExistente = await prisma.tarefa.findUnique({
      where: { id }
    });

    if (!tarefaExistente) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    const tarefaAtualizada = await prisma.tarefa.update({
      where: { id },
      data: {
        feita: true,
        rating: Number(rating) || 0,
        feedback: feedback || "",
        usuarioId: userId || null,
      }
    });

    console.log("✅ Tarefa atualizada:", tarefaAtualizada.titulo);
    res.status(200).json(tarefaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
});

// ====================== USUÁRIOS ======================

// Criar usuário
app.post("/usuarios", async (req, res) => {
  try {
    const { name, apelido = "", setor, email, password } = req.body;

    if (!name || !email || !password || !setor) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    const novoUsuario = await prisma.usuario.create({
      data: {
        name,
        apelido,
        setor,
        email,
        password,
        pontuacao: 0
      },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Listar usuários
app.get("/usuarios", verificarToken, permitirRoles("ADMIN"), async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        name: true,
        apelido: true,
        pontuacao: true,
        role: true,
      },
      orderBy: { pontuacao: "desc" },
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

// ====================== LOGIN ======================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (password !== usuario.password) {
  console.log("senha digitada:", password)
  console.log("Senha correta:", usuario.password)
  return res.status(401).json({ error: "Senha incorreta" });
}
    const token = gerarToken(usuario);

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
      },  
    });
    console.log("Login sucessfuly by user:", usuario.name)
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no processo de login" });
  }
});

app.put(
  '/recalcularPontuacao',
  verificarToken,
  permitirRoles('ADMIN'),
  async (req, res) => {
    try {
      const usuarios = await prisma.usuario.findMany();

      if (usuarios.length === 0)
        return res.status(404).json({ error: 'Nenhum usuário encontrado' });

      const resultados = [];

      for (const usuario of usuarios) {
        const novaPontuacao = await atualizarPontuacao(usuario.id);
        resultados.push({
          usuarioId: usuario.id,
          nome: usuario.name,
          novaPontuacao
        });
      }

      res.json({
        message: 'Pontuações recalculadas com sucesso:',
        totalUsuarios: resultados.length,
        resultados
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao recalcular pontuações' });
    }
  }
);

app.listen(3000, () => {
  console.log('✅ Servidor rodando em http://localhost:3000');
});