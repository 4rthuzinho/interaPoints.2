const form = document.getElementById("formNovaTarefa");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o recarregamento da página

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();

  if (!titulo || !descricao) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/tarefas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ titulo, descricao })
    });

    if (!resposta.ok) {
      throw new Error("Erro ao criar tarefa");
    }

    alert("Tarefa criada com sucesso!");

    // Redireciona para a página principal
    window.location.href = "index.html";
  } catch (erro) {
    console.error("Erro ao criar tarefa:", erro);
    alert("Ocorreu um erro ao criar a tarefa.");
  }
});
