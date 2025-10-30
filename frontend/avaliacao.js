export function criarAreaDeAvaliacao(containerTarefa, callbackFinalizacao) {
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

  const stars = feedbackContainer.querySelectorAll(".star");
  let selectedRating = 0;

  stars.forEach(star => {
    const value = parseInt(star.getAttribute("data-value"));

    // ✅ Quando passa o mouse (hover)
    star.addEventListener("mouseover", () => {
      stars.forEach(s => {
        const sValue = parseInt(s.getAttribute("data-value"));
        s.classList.toggle("hover", sValue <= value);
      });
    });

    // ✅ Quando sai do hover
    star.addEventListener("mouseout", () => {
      stars.forEach(s => s.classList.remove("hover"));
    });

    // ✅ Quando clica (seleciona fixo)
    star.addEventListener("click", () => {
      selectedRating = value;
      stars.forEach(s => {
        const sValue = parseInt(s.getAttribute("data-value"));
        s.classList.toggle("selected", sValue <= selectedRating);
      });
    });
  });

  const submitBtn = feedbackContainer.querySelector(".submitFeedback");
  submitBtn.addEventListener("click", () => {
    const textarea = feedbackContainer.querySelector("textarea");
    const feedbackText = textarea.value.trim();

    if (selectedRating === 0) {
      alert("Por favor, selecione uma avaliação (1-5 estrelas).");
      return;
    }
    if (feedbackText === "") {
      alert("Por favor, insira seu feedback antes de finalizar.");
      return;
    }

    containerTarefa.classList.add("done");
    feedbackContainer.remove();

    const resultado = document.createElement("div");
    resultado.innerHTML = `Avaliação: ${selectedRating} / 5 ★<br>Feedback: ${feedbackText}`;
    containerTarefa.appendChild(resultado);

    if (typeof callbackFinalizacao === "function") callbackFinalizacao();
  });
}
