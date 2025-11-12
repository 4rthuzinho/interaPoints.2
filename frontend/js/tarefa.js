import { criarAreaDeAvaliacao } from './avaliacao.js';

export function salvarTarefa(tarefa) {
  const tarefas = obterTarefas();
  tarefas.push(tarefa);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

export function obterTarefas() {
  const dados = localStorage.getItem("tarefas");
  return dados ? JSON.parse(dados) : [];
}

export function criarTarefa(tarefaObj, atualizarContagem) {
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
