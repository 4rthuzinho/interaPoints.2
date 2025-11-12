// float.js
export function showFloat(mensagem, tipo = "aviso") {
    console.log("mensagem recebida no float:", mensagem);
  const float = document.createElement("div");
  float.classList.add("float-msg", tipo);
  float.textContent = mensagem;

  document.body.appendChild(float);

  // Remove depois de 3 segundos com animação de saída
  setTimeout(() => {
    float.style.animation = "floatOut 0.3s ease forwards";
    setTimeout(() => float.remove(), 300);
  }, 3000);
}