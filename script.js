import { criarTarefa, obterTarefas } from './tarefa.js';

const taskList = document.getElementById("taskList");
const tarefas = obterTarefas();

// Renderiza todas as tarefas da lista
tarefas.forEach(tarefa => {
  const elemento = criarTarefa(tarefa, atualizarContagem);
  taskList.appendChild(elemento);
});

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

// Chama ao carregar
atualizarContagem();

//mongodb+srv://arthurdainova:<db_password>@interapoints.wkmxlq5.mongodb.net/?appName=interapoints
//Nu5PlNYnF3p9CwmY