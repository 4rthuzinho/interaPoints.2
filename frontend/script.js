import { criarAreaDeAvaliacao } from "./avaliacao.js";

const taskList = document.getElementById("taskList");

// FORMULÁRIO DE CRIAR TAREFA
const form = document.getElementById("formNovaTarefa");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();

    if (!titulo || !descricao) {
      mostrarToast("Preencha título e descrição!", "error");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:3000/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao })
      });

      if (!resposta.ok) throw new Error();

      mostrarToast("✅ Tarefa criada!");
      form.reset();
    } catch {
      mostrarToast("❌ Erro ao criar tarefa.", "error");
    }
  });
}

// CRIAR ELEMENTO VISUAL DA TAREFA
function criarTarefa(tarefaObj, atualizarContagem) {
  const li = document.createElement("li");
  li.className = "task";
  li.dataset.id = tarefaObj.id;

  if (tarefaObj.feita) li.classList.add("done");

  li.innerHTML = `
    <div class="info">
      <strong>${tarefaObj.titulo}</strong>
      <p>${tarefaObj.descricao}</p>
    </div>
    ${!tarefaObj.feita ? `<button class="botaoConcluir">✓ Concluir</button>` : ""}
  `;

  if (tarefaObj.feita && tarefaObj.rating > 0) {
    const resultado = document.createElement("div");
    resultado.className = "resultadoFeedback";
    resultado.innerHTML = `⭐ ${tarefaObj.rating}/5<br>${tarefaObj.feedback}`;
    li.appendChild(resultado);
  }

  // ✅ AGORA: Concluir apenas abre avaliação — sem API aqui
  const botao = li.querySelector(".botaoConcluir");
  if (botao) {
    botao.addEventListener("click", () => {
      botao.style.display = "none"; // some na hora
      criarAreaDeAvaliacao(li, carregarTarefas, tarefaObj.id);
    });
  }

  return li;
}

// BUSCAR TAREFAS NO BACKEND
async function obterTarefas() {
  try {
    const resp = await fetch("http://localhost:3000/tarefas");
    if (!resp.ok) throw new Error();
    return await resp.json();
  } catch {
    mostrarToast("❌ Erro ao carregar tarefas", "error");
    return [];
  }
}

// EXIBIR LISTA
async function carregarTarefas() {
  if (!taskList) return;

  let tarefas = await obterTarefas();

  // ✅ Ordenar: pendentes primeiro, depois concluídas
  tarefas.sort((a, b) => {
    if (a.feita === b.feita) return 0; // ambos iguais
    return a.feita ? 1 : -1; // a.feita = false vem antes de true
  });

  taskList.innerHTML = "";

  tarefas.forEach(tarefa => {
    const elemento = criarTarefa(tarefa, atualizarContagem);
    taskList.appendChild(elemento);
  });

  atualizarContagem();
}


// ATUALIZAR PROGRESSO
function atualizarContagem() {
  const total = document.querySelectorAll(".task").length;
  const feitas = document.querySelectorAll(".task.done").length;
  const pendentes = total - feitas;

  if (document.getElementById("total")) {
    document.getElementById("total").textContent = total;
    document.getElementById("feitas").textContent = feitas;
    document.getElementById("pendentes").textContent = pendentes;

    const pct = total === 0 ? 0 : Math.round((feitas / total) * 100);
    const barra = document.getElementById("progresso");
    barra.style.width = `${pct}%`;
    barra.textContent = `${pct}%`;
  }
}

// TOAST
function mostrarToast(msg, tipo = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  if (tipo === "error") toast.classList.add("error");
  else toast.classList.remove("error");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// AO ABRIR A PÁGINA
window.addEventListener("DOMContentLoaded", carregarTarefas);

export { atualizarContagem, mostrarToast };
