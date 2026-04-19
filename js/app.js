(function () {
  'use strict';

  const DATA_URL = 'data/comunidades.json';
  let allCommunities = [];

  const communityGrid = document.getElementById('communityGrid');
  const communityCount = document.getElementById('communityCount');
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const emptyState = document.getElementById('emptyState');
  const navHorarios = document.getElementById('navHorarios');
  const navComunidades = document.getElementById('navComunidades');

  async function init() {
    try {
      const res = await fetch(DATA_URL);
      const data = await res.json();
      allCommunities = data.comunidades;
      renderCommunities(allCommunities);
      setupSearch();
      setupNavigation();
    } catch (err) {
      communityGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:32px 0; color: var(--on-surface-secondary);">
          <span class="material-icons-round" style="font-size:40px; display:block; margin-bottom:8px;">wifi_off</span>
          Erro ao carregar comunidades
        </div>`;
    }
  }

  function renderCommunities(communities) {
    if (communities.length === 0) {
      communityGrid.classList.add('hidden');
      emptyState.classList.remove('hidden');
      communityCount.textContent = '0';
      return;
    }

    communityGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    communityCount.textContent = communities.length;

    communityGrid.innerHTML = communities.map((c, i) => `
      <a href="comunidade.html?id=${c.id}" class="community-card" style="animation-delay: ${i * 30}ms" data-id="${c.id}">
        <div class="community-avatar-wrap">
          <img
            src="${c.foto}"
            alt="${c.nome}"
            class="community-avatar"
            loading="lazy"
            onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23CE93D8%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2232%22 font-family=%22sans-serif%22>${c.nome.charAt(0)}</text></svg>'"
          >
        </div>
        <span class="community-name">${c.nome}</span>
      </a>
    `).join('');
  }

  function setupSearch() {
    let debounceTimer;

    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      const query = this.value.trim();

      searchClear.classList.toggle('hidden', query.length === 0);

      debounceTimer = setTimeout(() => {
        if (query === '') {
          renderCommunities(allCommunities);
          return;
        }

        const normalized = normalizeString(query);
        const filtered = allCommunities.filter(c =>
          normalizeString(c.nome).includes(normalized)
        );
        renderCommunities(filtered);
      }, 200);
    });

    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      searchClear.classList.add('hidden');
      renderCommunities(allCommunities);
      searchInput.focus();
    });
  }

  function normalizeString(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function setupNavigation() {
    navHorarios.addEventListener('click', function (e) {
      e.preventDefault();
      const section = document.getElementById('horarios');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });

    navComunidades.addEventListener('click', function (e) {
      e.preventDefault();
      const section = document.getElementById('communityGrid');
      if (section) {
        section.closest('.section').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
