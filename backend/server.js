import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

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
  const { id, rating, feedback } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Necessário passar o ID.' });
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
        feedback: feedback || ""
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
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        name: true,
        apelido: true,
        pontuacao: true,
      },
      orderBy: {
        pontuacao: "desc",
      },
    });

    res.json(usuarios);
    console.log("Usuários:", usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

app.listen(3000, () => {
  console.log('✅ Servidor rodando em http://localhost:3000');
});