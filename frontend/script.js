import { criarTarefa } from './tarefa.js';

const taskList = document.getElementById("taskList");

// 🔹 Busca as tarefas do backend
async function obterTarefas() {
  try {
    const resposta = await fetch("http://localhost:3000/tarefas");
    if (!resposta.ok) {
      throw new Error("Erro ao buscar tarefas");
    }
    return await resposta.json();
  } catch (erro) {
    console.error("Erro ao carregar tarefas:", erro);
    return [];
  }
}

// 🔹 Renderiza tarefas na tela
async function carregarTarefas() {
  const tarefas = await obterTarefas();
  taskList.innerHTML = '';

  tarefas.forEach(tarefa => {
    const elemento = criarTarefa(tarefa, atualizarContagem);
    taskList.appendChild(elemento);
  });

  atualizarContagem();
}

// 🔹 Atualiza contadores e progresso
function atualizarContagem() {
  const total = document.querySelectorAll(".task").length;
  const feitas = document.querySelectorAll(".task.done").length;
  const pendentes = total - feitas;

  document.getElementById("total").textContent = total;
  document.getElementById("feitas").textContent = feitas;
  document.getElementById("pendentes").textContent = pendentes;

  const porcentagem = total === 0 ? 0 : Math.round((feitas / total) * 100);
  const barra = document.getElementById("progresso");
  barra.style.width = `${porcentagem}%`;
  barra.textContent = `${porcentagem}%`;
}

// 🔹 Quando a página carregar, busca e exibe as tarefas
window.addEventListener("DOMContentLoaded", carregarTarefas);
