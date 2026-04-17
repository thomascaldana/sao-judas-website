(function () {
  'use strict';

  const DATA_URL = 'data/comunidades.json';

  const appBarTitle = document.getElementById('appBarTitle');
  const loadingState = document.getElementById('loadingState');
  const detailContent = document.getElementById('detailContent');
  const errorState = document.getElementById('errorState');
  const communityPhoto = document.getElementById('communityPhoto');
  const communityName = document.getElementById('communityName');
  const communityPatron = document.getElementById('communityPatron');
  const communityAddress = document.getElementById('communityAddress');
  const communityMasses = document.getElementById('communityMasses');
  const communityPatronDay = document.getElementById('communityPatronDay');
  const communityDescription = document.getElementById('communityDescription');
  const communityContact = document.getElementById('communityContact');
  const whatsappBtn = document.getElementById('whatsappBtn');

  async function init() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10);

    if (!id) {
      showError();
      return;
    }

    try {
      const res = await fetch(DATA_URL);
      const data = await res.json();
      const community = data.comunidades.find(c => c.id === id);

      if (!community) {
        showError();
        return;
      }

      await simulateLoading(400);
      renderCommunity(community, data.paroquia);
    } catch {
      showError();
    }
  }

  function simulateLoading(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function renderCommunity(community, paroquia) {
    document.title = `${community.nome} - ${paroquia.nome}`;
    appBarTitle.textContent = community.nome;

    communityPhoto.src = community.foto;
    communityPhoto.alt = community.nome;
    communityPhoto.onerror = function () {
      this.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23CE93D8" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="32" font-family="sans-serif">${community.nome.charAt(0)}</text></svg>`;
    };

    communityName.textContent = community.nome;
    communityPatron.textContent = `Padroeiro: ${community.padroeiro}`;
    communityAddress.textContent = community.endereco;

    communityMasses.innerHTML = community.missas.map(m => `
      <div class="mass-item">
        <span class="mass-day">${m.dia}</span>
        <span class="mass-time">${m.horario}</span>
      </div>
    `).join('');

    communityPatronDay.textContent = community.diaDoPadroeiro;
    communityDescription.textContent = community.descricao;
    communityContact.textContent = community.contato;

    const whatsappMessage = encodeURIComponent(
      `Olá, gostaria de informações sobre a comunidade ${community.nome}.`
    );
    whatsappBtn.href = `https://wa.me/${paroquia.whatsapp}?text=${whatsappMessage}`;

    loadingState.classList.add('hidden');
    detailContent.classList.remove('hidden');
  }

  function showError() {
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
