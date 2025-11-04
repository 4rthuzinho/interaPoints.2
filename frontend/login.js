const btnLogin = document.getElementById("btnLogin");
const erro = document.getElementById("erro");

btnLogin.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    erro.textContent = "Preencha e-mail e senha.";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      erro.textContent = data.error || "Falha no login.";
      return;
    }

    // salva token e role no navegador
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("usuario", JSON.stringify(data.user));

    // redireciona para a página principal
    window.location.href = "index.html";
  } catch (e) {
    console.error("Erro ao logar:", e);
    erro.textContent = "Erro de conexão com o servidor.";
  }
});
// ===== AVISO SUPORTE =====
const linkEsqueceu = document.getElementById("linkEsqueceu");
const aviso = document.getElementById("avisoSuporte");
const fecharAviso = document.getElementById("fecharAviso");

if (linkEsqueceu) {
  linkEsqueceu.addEventListener("click", (e) => {
    e.preventDefault();
    aviso.classList.remove("hidden");
  });
}

if (fecharAviso) {
  fecharAviso.addEventListener("click", () => {
    aviso.classList.add("hidden");
  });
}
