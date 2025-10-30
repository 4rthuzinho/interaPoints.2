import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

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

app.listen(3000, () => {
  console.log('✅ Servidor rodando em http://localhost:3000');
});