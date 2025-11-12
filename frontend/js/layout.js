// frontend/js/layout.js
import { showFloat } from "../components/float/float.js";

document.addEventListener("DOMContentLoaded", () => {
  const conteudo = document.getElementById("conteudo");
  const links = document.querySelectorAll(".menu-lateral a");
  const btnLogout = document.getElementById("btnLogout");

  // --- 1. Verifica autenticação ---
  const token = localStorage.getItem("token");
  if (!token) {
    showFloat("Sessão expirada. Faça login novamente.", "erro");
    setTimeout(() => {
      window.location.href = "../login/login.html";
    }, 1200);
    return;
  }

  // --- 2. Logout ---
  btnLogout?.addEventListener("click", () => {
    localStorage.clear();
    showFloat("Sessão encerrada.", "aviso");
    setTimeout(() => {
      window.location.href = "../login/login.html";
    }, 1000);
  });

  // --- 3. Navegação lateral dinâmica ---
  links.forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();
      const url = link.dataset.page;
      if (!url) return;

      // Atualiza menu ativo
      links.forEach(l => l.classList.remove("ativo"));
      link.classList.add("ativo");

      // Mostra loading
      conteudo.innerHTML = `<div class="loading">Carregando conteúdo...</div>`;

      try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro ao carregar página");
        const html = await resposta.text();
        conteudo.innerHTML = html;

        // --- Importa script da página ---
        await carregarScriptDinamico(url);
      } catch (erro) {
        conteudo.innerHTML = `<p style="color:red; text-align:center;">Erro ao carregar conteúdo.</p>`;
        console.error("Erro ao carregar página:", erro);
      }
    });
  });

  // --- 4. Carrega página inicial automaticamente ---
  const linkInicial = document.querySelector(".menu-lateral a.ativo");
  if (linkInicial) {
    const url = linkInicial.dataset.page;
    if (url) {
      fetch(url)
        .then(res => res.text())
        .then(async html => {
          conteudo.innerHTML = html;
          await carregarScriptDinamico(url);
        })
        .catch(() => {
          conteudo.innerHTML = "<p>Erro ao carregar a página inicial.</p>";
        });
    }
  }
});

/**
 * Carrega dinamicamente o JS associado à página
 * Ex: pages/home.html → js/pages/home.js
 */
async function carregarScriptDinamico(url) {
  const nomePagina = url.split("/").pop().replace(".html", "");
  const caminhoModulo = `./${nomePagina}.js`;

  try {
    const modulo = await import(caminhoModulo);
    if (typeof modulo[`init${capitalize(nomePagina)}`] === "function") {
      modulo[`init${capitalize(nomePagina)}`]();
    } else if (typeof modulo.default === "function") {
      modulo.default();
    }
  } catch (err) {
    console.warn(`Sem script específico para ${nomePagina}.`);
  }
}

// Utilitário pra capitalizar a primeira letra
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}