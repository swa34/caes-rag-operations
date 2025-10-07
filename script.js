// ===== Data (existing featuresData retained) =====
// NOTE: You already had this array populated; keep yours or merge new entries.
const featuresData = window.featuresData || []; // if you already embed it separately

// Example optimizations to render (compact demo)
const optimizations = [
  {
    name: 'In-Memory Acronym Cache',
    impact: 'high',
    desc: 'Zero-latency acronym expansion using cached PostgreSQL data.',
    metrics: [
      ['Latency Impact', '0–2ms'],
      ['DB Query Saved', '50–100ms'],
    ],
  },
  {
    name: 'Smart LLM Re-ranking Triggers',
    impact: 'high',
    desc: 'Trigger on ambiguous/temporal/comparison queries only.',
    metrics: [
      ['Cost Savings', '70–80%'],
      ['Latency Cost', '+200–400ms'],
    ],
  },
  {
    name: 'Metadata Filtering at DB Level',
    impact: 'medium',
    desc: 'Native filter reduces vector comparisons.',
    metrics: [
      ['Precision', '+15–25%'],
      ['Latency', '+0ms'],
    ],
  },
];

// Simple architecture items (same visuals as before, just rendered here)
const architecture = {
  client: [
    ['🌐', 'Web UI', 'React chat interface'],
    ['📱', 'API Clients', 'REST consumers'],
  ],
  app: [
    ['🚀', 'Express Server', 'src/server.js'],
    ['🔐', 'Auth Middleware', 'Multi-user basic auth'],
    ['💬', 'Conversation Memory', 'PostgreSQL sessions'],
  ],
  rag: [
    [
      '🧠',
      '5-Stage Pipeline',
      'Acronym → Metadata → Vector → Feedback → Re-rank',
    ],
    ['🔄', 'Question Reframer', 'Context-aware reframing'],
    ['📊', 'Feedback Learning', 'Score adjustment'],
  ],
  data: [
    ['🗄️', 'PostgreSQL', 'Conversations, feedback, acronyms'],
    ['🔍', 'Pinecone', 'Vector DB (3072-dim)'],
    ['📄', 'Google Sheets', 'Feedback fallback'],
  ],
  external: [
    ['🤖', 'OpenAI API', 'Embeddings + Gen + Re-rank'],
    ['📦', 'Dropbox API', 'Document fetching'],
  ],
};

// ===== Utilities =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function debounce(fn, delay = 180) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
function getParams() {
  return new URLSearchParams(location.search);
}
function setParam(key, val) {
  const url = new URL(location.href);
  if (!val) url.searchParams.delete(key);
  else url.searchParams.set(key, val);
  history.replaceState({}, '', url.toString());
}
function highlight(text, term) {
  if (!term) return text;
  const re = new RegExp(
    `(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'ig'
  );
  return text.replace(re, '<mark>$1</mark>');
}

// ===== Renderers =====
function renderPipeline() {
  const container = $('#pipelineStages');
  if (!container) return;
  const stages = [
    {
      n: 1,
      title: 'Acronym Expansion',
      desc: 'Expands 210 UGA-specific acronyms',
      details: ['Zero Latency', 'In-Memory Cache'],
      ref: 'src/rag/utils/acronymExpander.js',
    },
    {
      n: 2,
      title: 'Metadata Filtering',
      desc: 'Query-aware category detection',
      details: ['15–25% Precision Boost', 'Native DB Operation'],
      ref: 'src/rag/vector-ops/retrieve.js:149-190',
    },
    {
      n: 3,
      title: 'Vector Search',
      desc: 'Pinecone semantic similarity',
      details: ['3072 Dimensions', 'Cosine Similarity'],
      ref: 'src/rag/utils/pineconeClient.js',
    },
    {
      n: 4,
      title: 'Feedback Learning',
      desc: 'Score adjustment from user feedback',
      details: ['±10% Score Adjustment', 'PostgreSQL Cache'],
      ref: 'src/rag/feedback/feedbackLearningPostgres.js',
    },
    {
      n: 5,
      title: 'LLM Re-ranking',
      desc: 'Semantic reordering when needed',
      details: ['20–30% Trigger Rate', 'GPT-4o-mini'],
      ref: 'src/rag/vector-ops/retrieve.js:23-101',
    },
  ];
  for (const s of stages) {
    const div = document.createElement('div');
    div.className = 'pipeline-stage';
    div.innerHTML = `
      <div class="stage-number">${s.n}</div>
      <div class="stage-content">
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <div class="stage-details">${s.details
          .map(d => `<span class="detail-badge">${d}</span>`)
          .join('')}</div>
        <code class="code-ref" data-copy="${s.ref}" title="Click to copy">${
      s.ref
    }</code>
      </div>
      <div class="stage-arrow">→</div>
    `;
    container.appendChild(div);
  }
}

function renderOptimizations() {
  const grid = $('#optimizationsGrid');
  if (!grid) return;
  for (const o of optimizations) {
    const card = document.createElement('div');
    card.className = 'optimization-card';
    card.innerHTML = `
      <div class="optimization-header">
        <h3>${o.name}</h3>
        <span class="impact-badge ${o.impact}">${o.impact.toUpperCase()}</span>
      </div>
      <p class="optimization-description">${o.desc}</p>
      <div class="optimization-metrics">
        ${o.metrics
          .map(
            ([k, v]) => `
          <div class="metric">
            <span class="metric-label">${k}</span>
            <span class="metric-value">${v}</span>
          </div>`
          )
          .join('')}
      </div>
    `;
    grid.appendChild(card);
  }
}

function renderArchitecture() {
  const target = $('#architectureDiagram');
  if (!target) return;
  const layers = [
    ['Client Layer', architecture.client],
    ['Application Layer', architecture.app],
    ['RAG Pipeline Layer', architecture.rag],
    ['Data Layer', architecture.data],
    ['External Services', architecture.external],
  ];
  for (const [title, comps] of layers) {
    const wrap = document.createElement('div');
    wrap.className = 'arch-layer';
    wrap.innerHTML = `
      <h3 class="layer-title">${title}</h3>
      <div class="arch-components">
        ${comps
          .map(
            ([icon, name, desc], i) => `
          <div class="arch-component ${
            i === 0 && title.includes('RAG') ? 'highlight' : ''
          }">
            <div class="component-icon">${icon}</div>
            <div class="component-name">${name}</div>
            <div class="component-desc">${desc}</div>
          </div>`
          )
          .join('')}
      </div>
    `;
    target.appendChild(wrap);
    if (title !== 'External Services') {
      const arrow = document.createElement('div');
      arrow.className = 'arch-connector';
      arrow.textContent = '↓';
      target.appendChild(arrow);
    }
  }
  // Simple tech tiles
  const tech = $('#techGrid');
  if (tech) {
    [
      'Backend: Node.js, Express',
      'Database: PostgreSQL (Sevalla)',
      'Vector DB: Pinecone Serverless',
      'AI Models: GPT-4o-mini, text-embedding-3-large',
      'Doc Processing: Python 3.8+',
      'Deployment: Sevalla Cloud',
    ].forEach(t => {
      const div = document.createElement('div');
      div.className = 'tech-item';
      div.innerHTML = `<strong>${t.split(':')[0]}:</strong> ${
        t.split(':')[1] || ''
      }`;
      tech.appendChild(div);
    });
  }
}

function renderFeatures(filter = 'all', term = '') {
  const grid = $('#featuresGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const active = featuresData.filter(f => {
    const matchCategory = filter === 'all' || f.category === filter;
    const text =
      `${f.name} ${f.category} ${f.description} ${f.implementation} ${f.details}`.toLowerCase();
    const matchTerm = term ? text.includes(term.toLowerCase()) : true;
    return matchCategory && matchTerm;
  });
  for (const f of active) {
    const slug = `${f.category}-${f.name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const url = new URL(location.href);
    url.searchParams.set('category', filter === 'all' ? '' : filter);
    if (term) url.searchParams.set('q', term);
    else url.searchParams.delete('q');
    url.hash = slug;

    const card = document.createElement('div');
    card.className = `feature-card ${f.category}`;
    card.setAttribute('data-category', f.category);
    card.id = slug;

    const nameHTML = highlight(f.name, term);
    const descHTML = highlight(f.description, term);
    const implHTML = highlight(f.implementation, term);
    const detailsHTML = highlight(f.details, term);

    card.innerHTML = `
      <button class="card-link" data-link="${url.toString()}" title="Copy link to this card">🔗</button>
      <div class="feature-header">
        <h3>${nameHTML}</h3>
        <span class="feature-tag">${f.category}</span>
      </div>
      <p class="feature-description">${descHTML}</p>
      <div class="feature-implementation">
        <strong>Implementation:</strong>
        <code>${implHTML}</code>
      </div>
      <div class="feature-details">
        <strong>Technical Details:</strong><br />
        ${detailsHTML}
      </div>
    `;
    grid.appendChild(card);
  }
}

function attachFilters() {
  const buttons = $$('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      setParam('category', filter === 'all' ? '' : filter);
      renderFeatures(
        filter,
        $('#globalSearch')?.value || getParams().get('q') || ''
      );
    });
  });
}

function injectSearch() {
  const input = document.createElement('input');
  input.type = 'search';
  input.id = 'globalSearch';
  input.placeholder = 'Search features…';
  input.className = 'feature-search';
  const filters = $('.feature-filters');
  if (filters) filters.insertAdjacentElement('afterend', input);
  input.addEventListener(
    'input',
    debounce(e => {
      const term = e.target.value.trim();
      setParam('q', term || '');
      const activeBtn = $('.filter-btn.active');
      const filter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
      renderFeatures(filter, term);
    })
  );
}

function copyOnClick() {
  document.addEventListener('click', e => {
    const linkBtn = e.target.closest('.card-link');
    const codeRef = e.target.closest('.code-ref');
    const exportBtn = e.target.closest('#exportBtn');
    if (linkBtn) {
      navigator.clipboard.writeText(linkBtn.dataset.link);
      linkBtn.textContent = '✓';
      setTimeout(() => (linkBtn.textContent = '🔗'), 1200);
    }
    if (codeRef) {
      const toCopy = codeRef.dataset.copy || codeRef.textContent;
      navigator.clipboard.writeText(toCopy);
      codeRef.textContent = '✓ Copied!';
      codeRef.style.color = '#10B981';
      setTimeout(() => {
        codeRef.textContent = toCopy;
        codeRef.style.color = '';
      }, 1500);
    }
    if (exportBtn) {
      const dd = exportBtn.nextElementSibling;
      const open = dd.classList.toggle('open');
      exportBtn.setAttribute('aria-expanded', String(open));
      dd.setAttribute('aria-expanded', String(open));
    }
  });
  // export actions
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-export]');
    if (!btn) return;
    const kind = btn.getAttribute('data-export');
    if (kind === 'json') {
      const blob = new Blob([JSON.stringify(featuresData, null, 2)], {
        type: 'application/json',
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'features.json';
      a.click();
    } else if (kind === 'print') {
      window.print();
    }
    $('.export-dropdown')?.classList.remove('open');
  });
}

function navBehavior() {
  const nav = $('.nav-links');
  const toggle = $('.nav-toggle');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target))
      nav.classList.remove('open');
  });
  // box shadow on scroll
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    $('.navbar').style.boxShadow =
      y > 100 ? '0 2px 10px rgba(0,0,0,.1)' : 'none';
    last = y;
  });
}

function backToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('show');
    else btn.classList.remove('show');
  });
  btn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

function darkMode() {
  const key = 'caes-docs-dark';
  const btn = $('#darkToggle');
  const apply = on => {
    document.body.classList.toggle('dark', on);
    btn?.setAttribute('aria-pressed', String(on));
    btn.textContent = on ? '☀️' : '🌙';
  };
  apply(localStorage.getItem(key) === '1');
  btn?.addEventListener('click', () => {
    const on = !document.body.classList.contains('dark');
    localStorage.setItem(key, on ? '1' : '0');
    apply(on);
  });
}

function applyParams() {
  const p = getParams();
  const cat =
    (p.get('category') || '').trim() ||
    (location.hash ? location.hash.replace('#', '') : '');
  const q = (p.get('q') || '').trim();
  if (q) {
    $('#globalSearch')?.setAttribute('value', q);
  }
  // activate filter button
  const toActivate =
    cat && $(`.filter-btn[data-filter="${cat}"]`) ? cat : 'all';
  $$('.filter-btn').forEach(b => b.classList.remove('active'));
  $(`.filter-btn[data-filter="${toActivate}"]`)?.classList.add('active');
  renderFeatures(toActivate, q);
  // if a deep-linked card exists, scroll it into view
  if (location.hash) {
    const target = document.getElementById(location.hash.replace('#', ''));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function animateOnScroll() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.12 }
  );
  $$(
    '.feature-card, .optimization-card, .overview-card, .pipeline-stage'
  ).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .6s ease-out, transform .6s ease-out';
    observer.observe(el);
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  renderPipeline();
  renderOptimizations();
  renderArchitecture();
  injectSearch(); // (You had this function already; now we call it)  ← reference
  attachFilters();
  copyOnClick();
  navBehavior();
  backToTop();
  darkMode();
  applyParams();
  animateOnScroll();
});
