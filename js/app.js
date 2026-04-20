(function () {
  'use strict';

  const DATA_URL = 'data/comunidades.json';
  let allCommunities = [];

  const communityGrid = document.getElementById('communityGrid');
  const communityCount = document.getElementById('communityCount');
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const emptyState = document.getElementById('emptyState');
  const navItems = document.querySelectorAll('.bottom-nav .nav-item[data-section]');

  async function init() {
    try {
      const res = await fetch(DATA_URL);
      const data = await res.json();
      allCommunities = data.comunidades;
      renderCommunities(allCommunities);
      setupSearch();
      setupNavigation();
      setupSectionObserver();
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
    navItems.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        var sectionId = this.getAttribute('data-section');
        var target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function setActiveNav(sectionId) {
    navItems.forEach(function (item) {
      if (item.getAttribute('data-section') === sectionId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function setupSectionObserver() {
    var sectionIds = ['hero', 'comunidades', 'horarios', 'contato'];
    var sectionMap = {};
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionMap[id] = el;
    });

    var visibleSections = {};

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visibleSections[entry.target.id] = entry.isIntersecting;
      });

      for (var i = 0; i < sectionIds.length; i++) {
        if (visibleSections[sectionIds[i]]) {
          setActiveNav(sectionIds[i]);
          return;
        }
      }
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sectionIds.forEach(function (id) {
      if (sectionMap[id]) observer.observe(sectionMap[id]);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
