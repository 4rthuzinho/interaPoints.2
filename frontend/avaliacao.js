import { mostrarToast, atualizarContagem } from "./script.js";

export function criarAreaDeAvaliacao(containerTarefa, callback, tarefaId) {
  const feedbackContainer = document.createElement("div");
  feedbackContainer.className = "feedback-container";

  feedbackContainer.innerHTML = `
    <div class="star-rating">
      <span class="star" data-value="1">★</span>
      <span class="star" data-value="2">★</span>
      <span class="star" data-value="3">★</span>
      <span class="star" data-value="4">★</span>
      <span class="star" data-value="5">★</span>
    </div>
    <textarea placeholder="Deixe seu feedback (obrigatório)"></textarea>
    <button class="submitFeedback">Enviar e Finalizar</button>
  `;

  containerTarefa.appendChild(feedbackContainer);

  let rating = 0;
  const stars = feedbackContainer.querySelectorAll(".star");

  stars.forEach(star => {
    const value = +star.dataset.value;

    star.addEventListener("mouseover", () => {
      stars.forEach(s => s.classList.toggle("hover", s.dataset.value <= value));
    });

    star.addEventListener("mouseout", () => {
      stars.forEach(s => s.classList.remove("hover"));
    });

    star.addEventListener("click", () => {
      rating = value;
      stars.forEach(s => s.classList.toggle("selected", s.dataset.value <= rating));
    });
  });

  feedbackContainer.querySelector(".submitFeedback").addEventListener("click", async () => {
    const feedbackText = feedbackContainer.querySelector("textarea").value.trim();

    if (rating === 0) {
      mostrarToast("⚠ Escolha de 1 a 5 estrelas!", "error");
      return;
    }
    if (feedbackText === "") {
      mostrarToast("⚠ Escreva um feedback!", "error");
      return;
    }

    try {
      await fetch("http://localhost:3000/tarefaOk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tarefaId, rating, feedback: feedbackText })
      });

      containerTarefa.classList.add("done");
      feedbackContainer.remove();

      const resultado = document.createElement("div");
      resultado.className = "resultadoFeedback";
      resultado.innerHTML = `⭐ ${rating}/5<br>${feedbackText}`;
      containerTarefa.appendChild(resultado);

      mostrarToast("✅ Tarefa concluída com sucesso!");
      if (callback) callback();
    } catch {
      mostrarToast("❌ Erro ao salvar, tente de novo.", "error");
    }
  });
}
