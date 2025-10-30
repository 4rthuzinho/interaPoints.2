import { salvarTarefa } from './tarefa.js';

const form = document.getElementById("formNovaTarefa");
const inputTitulo = document.getElementById("titulo");
const inputDescricao = document.getElementById("descricao");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const novaTarefa = {
    titulo: inputTitulo.value.trim(),
    descricao: inputDescricao.value.trim()
  };

  if (!novaTarefa.titulo || !novaTarefa.descricao) {
    alert("Preencha todos os campos.");
    return;
  }

  salvarTarefa(novaTarefa);
  window.location.href = "index.html";
});
