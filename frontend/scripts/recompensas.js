// scripts/recompensas.js
const API_URL = 'http://localhost:3000';

const listaEl = document.querySelector('#lista-recompensas');
const btnNova = document.querySelector('#btnNovaRecompensa');
const modal = document.querySelector('#modalRecompensa');
const salvarBtn = document.querySelector('#salvarRecompensa');
const cancelarBtn = document.querySelector('#cancelarRecompensa');

// TODO: depois implementaremos fetch real da API
const recompensas = [
  { id: 1, titulo: 'Camiseta exclusiva', valor: 100, status: 'active' },
  { id: 2, titulo: 'Vale almoço', valor: 50, status: 'claimed' },
];

function renderRecompensas() {
  listaEl.innerHTML = '';
  recompensas.forEach(r => {
    const card = document.createElement('div');
    card.classList.add('card-recompensa');
    card.innerHTML = `
      <h3>${r.titulo}</h3>
      <p><strong>${r.valor}</strong> pontos</p>
      <p>Status: ${r.status}</p>
      ${r.status === 'active' ? '<button>Resgatar</button>' : ''}
    `;
    listaEl.appendChild(card);
  });
}

btnNova.addEventListener('click', () => modal.classList.remove('hidden'));
cancelarBtn.addEventListener('click', () => modal.classList.add('hidden'));
salvarBtn.addEventListener('click', () => {
  // Implementaremos criação via API no próximo passo
  modal.classList.add('hidden');
});

renderRecompensas();