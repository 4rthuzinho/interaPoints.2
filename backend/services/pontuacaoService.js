// services/pontuacaoService.js
import { PrismaClient } from '@prisma/client'

// Cria uma instância do Prisma
const prisma = new PrismaClient()

// Recalcula pontuação com base nas tarefas concluídas do usuário
export async function atualizarPontuacao(usuarioId) {
  // Busca todas as tarefas concluídas do usuário
  const tarefasConcluidas = await prisma.tarefa.findMany({
    where: { usuarioId, feita: true },
    select: { id: true, titulo: true, feita: true, valor: true }
  })

  // Soma os valores
  const pontuacao = tarefasConcluidas.reduce((total, tarefa) => total + tarefa.valor, 0)

  // Atualiza o usuário com a nova pontuação
  await prisma.usuario.update({
    where: { id: usuarioId },
    data: { pontuacao }
  })
  return pontuacao
}