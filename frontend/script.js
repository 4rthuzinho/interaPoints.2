import { criarAreaDeAvaliacao } from "./avaliacao.js";

const taskList = document.getElementById("taskList");
let filtroAtual = "todas"; // padrão

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

    // ✅ Mostrar loading
    mostrarLoading(true);

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
    } finally {
      // ✅ Esconde loading, mesmo com erro
      mostrarLoading(false);
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

  // Ordena: pendentes primeiro
  tarefas.sort((a, b) => (a.feita === b.feita ? 0 : a.feita ? 1 : -1));

  taskList.innerHTML = "";

  tarefas.forEach(tarefa => {
    const elemento = criarTarefa(tarefa, atualizarContagem);
    taskList.appendChild(elemento);
  });

  atualizarContagem();

  // ✅ Mantém o filtro que estava ativo
  aplicarFiltro(filtroAtual);
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

// FILTRAR TAREFAS
const botoesFiltro = document.querySelectorAll(".filtro-btn");

botoesFiltro.forEach(botao => {
  botao.addEventListener("click", () => {
  botoesFiltro.forEach(b => b.classList.remove("ativo"));
  botao.classList.add("ativo");

  filtroAtual = botao.getAttribute("data-filtro"); // ← salva filtro atual
  aplicarFiltro(filtroAtual);
});
});

function aplicarFiltro(filtro) {
  const tarefas = document.querySelectorAll(".task");

  tarefas.forEach(tarefa => {
    const isDone = tarefa.classList.contains("done");

    if (filtro === "todas") {
      tarefa.style.display = "flex";
    } else if (filtro === "pendentes") {
      tarefa.style.display = isDone ? "none" : "flex";
    } else if (filtro === "concluidas") {
      tarefa.style.display = isDone ? "flex" : "none";
    }
  });
}
function mostrarLoading(mostrar) {
  const loader = document.getElementById("loading");
  if (!loader) return;
  if (mostrar) loader.classList.remove("hidden");
  else loader.classList.add("hidden");
}


// AO ABRIR A PÁGINA
window.addEventListener("DOMContentLoaded", carregarTarefas);

export { atualizarContagem, mostrarToast };
