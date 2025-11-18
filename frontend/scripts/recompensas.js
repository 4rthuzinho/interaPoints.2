// scripts/recompensas.js
const API_URL = "http://localhost:3000/recompensas";

const listaEl = document.querySelector("#lista-recompensas");
const btnNova = document.querySelector("#btnNovaRecompensa");
const modal = document.querySelector("#modalRecompensa");
const salvarBtn = document.querySelector("#salvarRecompensa");
const cancelarBtn = document.querySelector("#cancelarRecompensa");

const userData = JSON.parse(localStorage.getItem("usuario"));
if (userData?.role === "ADMIN") {
  document.body.classList.add("admin");
}

async function carregarRecompensas() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar recompensas");
    }

    const recompensas = await response.json();
    renderRecompensas(recompensas);
  } catch (err) {
    console.error("Erro ao carregar recompensas:", err);
    listaEl.innerHTML = `<p style="color:red;">Erro ao carregar recompensas 😕</p>`;
  }
}

function renderRecompensas(recompensas) {
  recompensas.sort((a, b) => (a.status === b.status ? 0 : a.active ? 1 : -1));
  listaEl.innerHTML = "";

  if (!recompensas.length) {
    listaEl.innerHTML = "<p>Nenhuma recompensa encontrada.</p>";
    return;
  }

  recompensas.forEach((r) => {
    const card = document.createElement("div");
    card.classList.add("card-recompensa");
    card.innerHTML =`
      <h3>${r.titulo}</h3>
      <p><strong>${r.valor}</strong> pontos</p>
      <p>Status: ${r.status}</p>
      ${
        r.status === "active"
          ? `<button data-id="${r.id}" class="btn-resgatar">Resgatar</button>`
          : `<button disabled class="${r.status}">${r.status}</button>`
      }
    `;
    // console.log(r.status)
    listaEl.appendChild(card);
  });

  // adiciona eventos aos botões de resgatar
  document.querySelectorAll(".btn-resgatar").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const userData = JSON.parse(localStorage.getItem("usuario"));
      const token = localStorage.getItem("token");

      if (!userData || !token) {
        alert("Você precisa estar logado para resgatar recompensas.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "claimed",
            usuarioId: userData.id,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Erro ao resgatar recompensa.");
        }

        const data = await response.json();
        console.log("Recompensa resgatada:", data.recompensa);

        alert("🎉 Recompensa resgatada com sucesso!");
        await carregarRecompensas(); // recarrega a lista atualizada
      } catch (err) {
        console.error("Erro ao resgatar recompensa:", err);
        alert(err.message);
      }
    });
  });
} 

// Modal controle
btnNova.addEventListener("click", () => modal.classList.remove("hidden"));
cancelarBtn.addEventListener("click", () => modal.classList.add("hidden"));

// --- Função: salvar nova recompensa (ADMIN) ---
salvarBtn.addEventListener("click", async () => {
  const titulo = document.querySelector("#tituloRecompensa").value.trim();
  const valor = parseInt(document.querySelector("#valorRecompensa").value);

  // validação simples
  if (!titulo || !valor) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado como ADMIN para criar recompensas.");
      return;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ titulo, valor }),
    });

    // se backend retornou erro, trata
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao criar recompensa.");
    }

    // sucesso: resposta da API
    const data = await response.json();
    console.log("Recompensa criada:", data.recompensa);

    // fecha modal e limpa os campos
    modal.classList.add("hidden");
    document.querySelector("#tituloRecompensa").value = "";
    document.querySelector("#valorRecompensa").value = "";

    // recarrega lista atualizada de recompensas
    await carregarRecompensas();

  } catch (err) {
    console.error("Erro ao criar recompensa:", err);
    alert("Erro ao criar recompensa. Verifique se está logado como ADMIN.");
  }
});

// Chama na inicialização
carregarRecompensas();