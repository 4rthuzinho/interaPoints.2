// frontend/js/pages/home.js
import { showFloat } from "../../components/float/float.js";

export function initHome() {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const pontuacao = localStorage.getItem("userPontuacao");

    // Verifica se a sessão ainda é válida
    if (!token || !userId) {
      showFloat("Sessão expirada. Faça login novamente.", "erro");
      setTimeout(() => {
        window.location.href = "../login/login.html";
      }, 1200);
      return;
    }

    // Atualiza o nome e a pontuação
    const nomeUsuarioEl = document.getElementById("nomeUsuario");
    const pontuacaoValorEl = document.getElementById("pontuacaoValor");

    if (nomeUsuarioEl && userName) {
      nomeUsuarioEl.textContent = `Bem-vindo(a), ${userName} 👋`;
    }

    if (pontuacaoValorEl) {
      pontuacaoValorEl.textContent = pontuacao ?? "0";
    }

    // Toast na primeira visita
    if (!sessionStorage.getItem("dashboardVisitado")) {
      showFloat("Dashboard carregado com sucesso!", "sucesso");
      sessionStorage.setItem("dashboardVisitado", "true");
    }
  } catch (err) {
    console.error("Erro ao inicializar o Home:", err);
    showFloat("Erro ao carregar o dashboard.", "erro");
  }
}