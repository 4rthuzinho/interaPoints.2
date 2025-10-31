import { criarAreaDeAvaliacao } from './avaliacao.js';

const taskList = document.getElementById("taskList");

// ✅ FORMULÁRIO (somente existe na tela de "Nova Tarefa")
const form = document.getElementById("formNovaTarefa");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();

    if (!titulo || !descricao) {
      alert("Preencha título e descrição!");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:3000/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao })
      });

      if (!resposta.ok) {
        throw new Error("Erro ao criar tarefa");
      }

      const novaTarefa = await resposta.json();
      mostrarToast("✅ Tarefa criada com sucesso!");
      console.log("✅ Tarefa criada:", novaTarefa);

      form.reset(); // limpa o formulário

      // ✅ Se quiser, pode redirecionar depois de criar:
      // window.location.href = "index.html"; // onde mostra as tarefas

    } catch (erro) {
      console.error("Erro ao enviar tarefa:", erro);
      mostrarToast("❌ Erro ao criar tarefa.", "error");
    }
  });
}

// 🔹 Cria visualmente uma tarefa com botão de concluir
function criarTarefa(tarefaObj, atualizarContagem) {
  const li = document.createElement("li");
  li.className = "task";

  li.innerHTML = `
    <div class="info">
      <strong>${tarefaObj.titulo}</strong>
      <p>${tarefaObj.descricao}</p>
    </div>
    <button class="botaoConcluir">✓ Concluir</button>
  `;

  const botao = li.querySelector(".botaoConcluir");
  botao.addEventListener("click", () => {
    botao.style.display = "none";
    criarAreaDeAvaliacao(li, atualizarContagem);
  });

  return li;
}

// 🔹 Busca as tarefas do backend
async function obterTarefas() {
  try {
    const resposta = await fetch("http://localhost:3000/tarefas");
    if (!resposta.ok) throw new Error("Erro ao buscar tarefas");
    return await resposta.json();
  } catch (erro) {
    console.error("Erro ao carregar tarefas:", erro);
    return [];
  }
}

// 🔹 Renderiza tarefas na tela
async function carregarTarefas() {
  if (!taskList) return; // garante que só roda onde existe a lista

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

  if (document.getElementById("total")) {
    document.getElementById("total").textContent = total;
    document.getElementById("feitas").textContent = feitas;
    document.getElementById("pendentes").textContent = pendentes;

    const porcentagem = total === 0 ? 0 : Math.round((feitas / total) * 100);
    const barra = document.getElementById("progresso");
    barra.style.width = `${porcentagem}%`;
    barra.textContent = `${porcentagem}%`;
  }
}
function mostrarToast(mensagem, tipo = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = mensagem;

  if (tipo === "error") {
    toast.classList.add("error");
  } else {
    toast.classList.remove("error");
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // 3 segundos e some
}


// 🔹 Quando a página carregar, se tiver lista, renderiza
window.addEventListener("DOMContentLoaded", carregarTarefas);
