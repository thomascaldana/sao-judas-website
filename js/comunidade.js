(function () {
  'use strict';

  const DATA_URL = 'data/comunidades.json';

  const appBarTitle = document.getElementById('appBarTitle');
  const loadingState = document.getElementById('loadingState');
  const detailContent = document.getElementById('detailContent');
  const errorState = document.getElementById('errorState');
  const communityCoverWrap = document.getElementById('communityCoverWrap');
  const communityCover = document.getElementById('communityCover');
  const detailHeader = document.getElementById('detailHeader');
  const communityPhoto = document.getElementById('communityPhoto');
  const communityName = document.getElementById('communityName');
  const communityPatron = document.getElementById('communityPatron');
  const communityAddress = document.getElementById('communityAddress');
  const communityMasses = document.getElementById('communityMasses');
  const activitiesCard = document.getElementById('activitiesCard');
  const communityActivities = document.getElementById('communityActivities');
  const secretaryCard = document.getElementById('secretaryCard');
  const communitySecretary = document.getElementById('communitySecretary');
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

    if (community.capa) {
      communityCover.src = community.capa;
      communityCover.alt = `Igreja ${community.nome}`;
      communityCoverWrap.classList.remove('hidden');
      detailHeader.classList.add('detail-header-with-cover');
      communityCover.onerror = function () {
        communityCoverWrap.classList.add('hidden');
        detailHeader.classList.remove('detail-header-with-cover');
      };
    }

    communityPhoto.src = community.foto;
    communityPhoto.alt = community.nome;
    communityPhoto.onerror = function () {
      this.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23CE93D8" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="32" font-family="sans-serif">${community.nome.charAt(0)}</text></svg>`;
    };

    communityName.textContent = community.nome;
    communityPatron.textContent = community.isMatriz
      ? `Padroeiro: ${community.padroeiro} · Igreja Matriz`
      : `Padroeiro: ${community.padroeiro}`;
    communityAddress.textContent = community.endereco;

    communityMasses.innerHTML = community.missas.map(m => `
      <div class="mass-item">
        <div class="mass-item-left">
          <span class="mass-day">${m.dia}</span>
          ${m.detalhe ? `<span class="mass-detail">${m.detalhe}</span>` : ''}
        </div>
        <span class="mass-time">${m.horario}</span>
      </div>
    `).join('');

    if (community.atividades && community.atividades.length > 0) {
      activitiesCard.classList.remove('hidden');
      communityActivities.innerHTML = community.atividades.map(a => `
        <div class="mass-item">
          <div class="mass-item-left">
            <span class="mass-day">${a.nome}</span>
            <span class="mass-detail">${a.dia}</span>
          </div>
          <span class="mass-time">${a.horario}</span>
        </div>
      `).join('');
    }

    if (community.isMatriz && paroquia.secretaria) {
      secretaryCard.classList.remove('hidden');
      communitySecretary.innerHTML = `
        <div class="mass-item">
          <span class="mass-day">Segunda a quinta-feira</span>
          <span class="mass-time">${paroquia.secretaria.segQuinta}</span>
        </div>
        <div class="mass-item">
          <span class="mass-day">Sexta e sábado</span>
          <span class="mass-time">${paroquia.secretaria.sexSabado}</span>
        </div>
      `;
    }

    communityPatronDay.textContent = community.diaDoPadroeiro;
    communityDescription.textContent = community.descricao;

    const whatsappNum = community.whatsapp || paroquia.whatsapp;
    const phone = community.contato || paroquia.telefone;

    communityContact.innerHTML = `
      <div class="contact-row">
        <span class="material-icons-round contact-icon">call</span>
        <a href="tel:+${phone.replace(/\D/g, '')}">${phone}</a>
      </div>
      ${whatsappNum ? `
      <div class="contact-row contact-row-whatsapp">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366" class="contact-whatsapp-icon">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <a href="https://wa.me/${whatsappNum}" target="_blank" rel="noopener">${paroquia.telefoneWhatsapp || formatPhone(whatsappNum)}</a>
      </div>` : ''}
    `;

    const whatsappMessage = encodeURIComponent(
      `Olá, gostaria de informações sobre a comunidade ${community.nome}.`
    );
    whatsappBtn.href = `https://wa.me/${whatsappNum}?text=${whatsappMessage}`;

    loadingState.classList.add('hidden');
    detailContent.classList.remove('hidden');
  }

  function formatPhone(num) {
    if (num.length === 13) {
      return `(${num.slice(2,4)}) ${num.slice(4,9)}-${num.slice(9)}`;
    }
    return num;
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
