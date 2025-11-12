import { showFloat } from "../components/float/float.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  btnLogin.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validação inicial
    if (!email || !password) {
      showFloat("Por favor, preencha e-mail e senha.", "aviso");
      return; // mantém esse return — ele só sai do clique, não trava nada
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
    const mensagemErro = data.message || data.error || "Erro desconhecido.";
    console.warn("Erro de login recebido:", mensagemErro);
    showFloat(mensagemErro, "erro"); // 👈 aqui o float aparece!
    return;
  }

      // Login bem-sucedido
      showFloat("Login realizado com sucesso!", "sucesso");

      // Salva token e redireciona após pequeno delay (pra exibir o toast)
      // Salva token e dados do usuário
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userPontuacao", data.user.pontuacao ?? 0);
        

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1200);
    } catch (err) {
      console.log("erro login")
      console.error("Erro ao fazer login:", err);
      showFloat("Erro de conexão com o servidor.", "erro");
      return;
    }
  });
});