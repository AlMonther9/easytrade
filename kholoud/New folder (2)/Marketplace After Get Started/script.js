'use strict';

/* ---------------- Data ---------------- */

const AVATARS = {
  techglobal: 'assets/img/avatars/techglobal.jpg',
  urbannest: 'assets/img/avatars/urbannest.jpg',
  precision: 'assets/img/avatars/precision.jpg',
};

const IMAGES = [
  'assets/img/products/headphones.png',
  'assets/img/products/chair.png',
  'assets/img/products/watch.png',
];

const CATEGORIES = [
  'Electronics & Tech',
  'Home & Living',
  'Apparel & Textiles',
  'Industrial Parts',
  'Office Supplies',
];

const FEATURED = [
  {
    name: 'Pro-Audio Wireless Studio Headphones',
    category: 'Electronics & Tech',
    price: 45.5,
    minUnits: 50,
    badge: 'WHOLESALE',
    image: IMAGES[0],
    supplier: { name: 'TechGlobal Ltd.', avatar: AVATARS.techglobal, tier: 'VERIFIED', verified: true, response: 98, location: 'Cairo' },
  },
  {
    name: 'Nordic Minimalist Ergonomic Chair',
    category: 'Electronics & Tech',
    price: 89.0,
    minUnits: 20,
    badge: 'SAMPLE READY',
    image: IMAGES[1],
    supplier: { name: 'UrbanNest Imports', avatar: AVATARS.urbannest, tier: 'VERIFIED', verified: true, response: 98, location: 'Cairo' },
  },
  {
    name: 'Elite Series 4 Smart Watch Pro',
    category: 'Electronics & Tech',
    price: 12.2,
    minUnits: 200,
    badge: 'HOT DEAL',
    image: IMAGES[2],
    supplier: { name: 'Precision Manuf.', avatar: AVATARS.precision, tier: 'STANDARD', verified: true, response: 98, location: 'Cairo' },
  },
];

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260920);
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const between = (min, max) => min + rng() * (max - min);

const NAME_POOL = {
  'Electronics & Tech': {
    prefixes: ['Pro-Audio', 'Elite Series', 'Ultra', 'Vertex', 'PrimeLine', 'NovaTech', 'Axiom', 'Zenith', 'CoreMax', 'Delta', 'Orbit', 'Skyline'],
    bases: ['Wireless Earbuds', 'Smart LED Panel', 'USB-C Hub', 'Bluetooth Speaker', '4K Action Camera', 'Mechanical Keyboard', 'Noise-Cancelling Headset', 'Smart Plug Pack', 'Portable Projector', 'Gaming Mouse', 'OLED Displays', 'Power Bank 20K'],
    suffixes: ['', 'v2', 'v3', 'Plus', 'Lite', 'Pro', 'Max', 'X', '2026 Edition'],
    price: [5, 120],
  },
  'Home & Living': {
    prefixes: ['Nordic', 'UrbanNest', 'Terra', 'Loom & Co', 'Sahara', 'GreenLeaf', 'Atelier', 'Casa'],
    bases: ['Bamboo Decor Set', 'Ceramic Vase', 'Linen Curtain Pair', 'Oak Side Table', 'Wall Shelf Kit', 'Rattan Basket', 'Minimal Desk Lamp', 'Wool Throw Blanket', 'Stoneware Dinner Set', 'Ergonomic Chair'],
    suffixes: ['', 'Natural', 'Matte', 'Handmade', 'Large', 'Mini'],
    price: [10, 150],
  },
  'Apparel & Textiles': {
    prefixes: ['NileTex', 'RedSea', 'CottonCo', 'WeaveWorks', 'Delta', 'Metro'],
    bases: ['Cotton Tee Bulk', 'Denim Jacket Lot', 'Sports Hoodie', 'Linen Shirt Pack', 'Knit Beanie Set', 'Workwear Polo', 'Fleece Zip-Up', 'Canvas Tote Batch'],
    suffixes: ['', 'S-M', 'L-XL', 'Mixed Sizes', 'Organic', 'Heavyweight'],
    price: [3, 40],
  },
  'Industrial Parts': {
    prefixes: ['Precision Manuf.', 'SteelCore', 'MechPro', 'IronDelta', 'TorqueMax'],
    bases: ['CNC Bearing Set', 'Hydraulic Valve', 'Steel Bracket Pack', 'Servo Motor Unit', 'Conveyor Roller', 'Welding Wire Spool', 'Pneumatic Fitting Kit'],
    suffixes: ['', 'Grade A', 'Heavy Duty', 'ISO-9001', 'Type B'],
    price: [8, 200],
  },
  'Office Supplies': {
    prefixes: ['PaperPlus', 'OfficePro', 'Cairo Craft', 'BrightDesk', 'UniPack'],
    bases: ['Eco Packaging Rolls', 'A4 Paper Carton', 'Gel Pen Bulk Pack', 'Desk Organizer Set', 'Whiteboard Kit', 'Toner Cartridge Pack', 'File Folder Bundle'],
    suffixes: ['', 'Recycled', 'Bulk 100', 'Bulk 500', 'Premium'],
    price: [2, 30],
  },
};

const SUPPLIER_POOL = [
  { name: 'TechGlobal Ltd.', avatar: AVATARS.techglobal },
  { name: 'UrbanNest Imports', avatar: AVATARS.urbannest },
  { name: 'Precision Manuf.', avatar: AVATARS.precision },
  { name: 'NileTex Trading', avatar: AVATARS.urbannest },
  { name: 'Alexandria Cargo Co.', avatar: AVATARS.precision },
  { name: 'Cairo Craft Union', avatar: AVATARS.techglobal },
  { name: 'Delta Components', avatar: AVATARS.techglobal },
  { name: 'RedSea Textiles', avatar: AVATARS.urbannest },
];

const LOCATIONS = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta', 'Aswan'];
const MIN_UNITS = [10, 20, 25, 50, 100, 200, 500];
const BADGES = ['WHOLESALE', 'WHOLESALE', 'SAMPLE READY', 'SAMPLE READY', 'HOT DEAL', null, null];

/* Counts are split verified / unverified so the default view (verified only)
   starts at 128 products while the toggle still changes the result set. */
const CATEGORY_COUNTS = {
  'Electronics & Tech': { verified: 128, unverified: 32 },
  'Home & Living': { verified: 30, unverified: 10 },
  'Apparel & Textiles': { verified: 26, unverified: 9 },
  'Industrial Parts': { verified: 22, unverified: 8 },
  'Office Supplies': { verified: 19, unverified: 6 },
};

function buildProducts() {
  const products = FEATURED.map((p, i) => ({ id: i, ...p }));
  let id = products.length;

  for (const category of CATEGORIES) {
    const pool = NAME_POOL[category];
    const counts = CATEGORY_COUNTS[category];
    const featuredVerified = FEATURED.filter((p) => p.category === category && p.supplier.verified).length;
    const used = new Set(products.filter((p) => p.category === category).map((p) => p.name));

    const make = (verified) => {
      let name = '';
      let guard = 0;
      do {
        name = `${pick(pool.prefixes)} ${pick(pool.bases)} ${pick(pool.suffixes)}`.replace(/\s+/g, ' ').trim();
        guard++;
      } while (used.has(name) && guard < 30);
      used.add(name);

      const base = SUPPLIER_POOL[Math.floor(rng() * SUPPLIER_POOL.length)];
      products.push({
        id: id++,
        name,
        category,
        price: Math.round(between(pool.price[0], pool.price[1]) * 100) / 100,
        minUnits: pick(MIN_UNITS),
        badge: pick(BADGES),
        image: IMAGES[Math.floor(rng() * IMAGES.length)],
        supplier: {
          name: base.name,
          avatar: base.avatar,
          tier: verified ? 'VERIFIED' : 'STANDARD',
          verified,
          response: Math.round(between(88, 99)),
          location: pick(LOCATIONS),
        },
      });
    };

    for (let n = 0; n < counts.verified - featuredVerified; n++) make(true);
    for (let n = 0; n < counts.unverified; n++) make(false);
  }
  return products;
}

const PRODUCTS = buildProducts();

/* ---------------- State ---------------- */

const PAGE_SIZE = 3;

/* ?q= arrives from the shared navbar, which searches from any page. */
const SEARCH_PARAM = (new URLSearchParams(window.location.search).get('q') || '').trim();

const state = {
  query: SEARCH_PARAM,
  categories: SEARCH_PARAM ? new Set() : new Set(['Electronics & Tech']),
  verifiedOnly: true,
  min: null,
  max: null,
  sort: 'relevant',
  page: 1,
  view: 'grid',
  wishlist: new Set(),
};

/* ---------------- Elements ---------------- */

const $ = (sel) => document.querySelector(sel);

const els = {
  headerSearch: $('#headerSearch'),
  heroSearch: $('#heroSearch'),
  heroForm: $('#heroSearchForm'),
  categorySelect: $('#categorySelect'),
  categoryFilters: $('#categoryFilters'),
  sortSelect: $('#sortSelect'),
  verifiedToggle: $('#verifiedToggle'),
  priceMin: $('#priceMin'),
  priceMax: $('#priceMax'),
  resultsCount: $('#resultsCount'),
  grid: $('#productGrid'),
  emptyState: $('#emptyState'),
  pagination: $('#pagination'),
  gridViewBtn: $('#gridViewBtn'),
  listViewBtn: $('#listViewBtn'),
  wishlistCount: $('#wishlistCount'),
  notifBtn: $('#notifBtn'),
  roleSwitch: $('#roleSwitch'),
  toastWrap: $('#toastWrap'),
  newsletterForm: $('#newsletterForm'),
  clearFilters: $('#clearFilters'),
};

/* ---------------- Helpers ---------------- */

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  els.toastWrap.appendChild(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 320);
  }, 2600);
}

/* Direct navigation for dynamically rendered cards, which the demo router only
   wires once at load. Paths mirror EasyTrade.url so both routes agree. */
const ROUTE_FALLBACK = {
  productDetails: '../B2B%20Product%20Details%20Page/index.html',
  plans: '../Supplier%20Subscription%20Plans/index.html',
};

function go(key) {
  window.location.href = window.EasyTrade ? window.EasyTrade.url(key) : ROUTE_FALLBACK[key];
}

function getFiltered() {
  const q = state.query.trim().toLowerCase();
  const list = PRODUCTS.filter((p) => {
    if (state.categories.size && !state.categories.has(p.category)) return false;
    if (state.verifiedOnly && !p.supplier.verified) return false;
    if (state.min !== null && p.price < state.min) return false;
    if (state.max !== null && p.price > state.max) return false;
    if (q && !(p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.supplier.name.toLowerCase().includes(q))) return false;
    return true;
  });

  if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (state.sort === 'response') list.sort((a, b) => b.supplier.response - a.supplier.response);
  return list;
}

function pageList(total, current) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, '…', total];
  if (current >= total - 2) return [1, '…', total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

/* ---------------- Render ---------------- */

function cardHTML(p) {
  const wished = state.wishlist.has(p.id);
  const badge = p.badge
    ? `<span class="badge${p.badge === 'HOT DEAL' ? ' hot' : ''}">${esc(p.badge)}</span>`
    : '';
  return `
  <article class="product-card">
    <div class="card-media">
      ${badge}
      <button class="heart-btn${wished ? ' active' : ''}" type="button" data-heart="${p.id}" aria-label="Save to wishlist" aria-pressed="${wished}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      </button>
      <img src="${p.image}" alt="${esc(p.name)}" loading="lazy">
    </div>
    <div class="card-body">
      <h3 class="card-title">${esc(p.name)}</h3>
      <p class="card-price">$${p.price.toFixed(2)} <span class="per">/ unit</span> <span class="min">(Min. ${p.minUnits} units)</span></p>
      <div class="card-supplier">
        <img class="supplier-avatar" src="${p.supplier.avatar}" alt="" loading="lazy">
        <div class="supplier-meta">
          <span class="supplier-name">${esc(p.supplier.name)}</span>
          <span class="tier ${p.supplier.tier.toLowerCase()}">${p.supplier.tier}</span>
        </div>
        <div class="supplier-stats">
          <div><span class="stat-label">Response</span><span class="stat-value">${p.supplier.response}%</span></div>
          <div><span class="stat-label">Location</span><span class="stat-value">${esc(p.supplier.location)}</span></div>
        </div>
      </div>
      <button class="btn-contact" type="button" data-et="plans" data-contact="${esc(p.supplier.name)}">Contact Supplier</button>
    </div>
  </article>`;
}

function render() {
  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  state.page = Math.min(Math.max(1, state.page), totalPages);

  els.resultsCount.innerHTML = `Showing <strong>${filtered.length}</strong> product${filtered.length === 1 ? '' : 's'}`;

  const slice = filtered.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);
  els.grid.innerHTML = slice.map(cardHTML).join('');
  els.grid.classList.toggle('list', state.view === 'list');
  els.emptyState.hidden = filtered.length !== 0;

  if (filtered.length === 0) {
    els.pagination.innerHTML = '';
    return;
  }

  const items = pageList(totalPages, state.page);
  els.pagination.innerHTML = `
    <span class="pager">
      <button type="button" data-page="prev" aria-label="Previous page" ${state.page === 1 ? 'disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      ${items
        .map((it) =>
          it === '…'
            ? '<span class="dots">…</span>'
            : `<button type="button" data-page="${it}" class="${it === state.page ? 'active' : ''}" aria-label="Page ${it}" ${it === state.page ? 'aria-current="page"' : ''}>${it}</button>`
        )
        .join('')}
      <button type="button" data-page="next" aria-label="Next page" ${state.page === totalPages ? 'disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </span>`;
}

function updateWishlistBadge() {
  const n = state.wishlist.size;
  els.wishlistCount.hidden = n === 0;
  els.wishlistCount.textContent = n;
}

function syncSearchInputs(source) {
  if (source !== els.headerSearch) els.headerSearch.value = state.query;
  if (source !== els.heroSearch) els.heroSearch.value = state.query;
}

function syncCategoryControls() {
  els.categoryFilters.querySelectorAll('input').forEach((input) => {
    input.checked = state.categories.has(input.value);
  });
  els.categorySelect.value = state.categories.size === 1 ? [...state.categories][0] : '';
}

/* ---------------- Events ---------------- */

function onSearchInput(e) {
  state.query = e.target.value;
  state.page = 1;
  syncSearchInputs(e.target);
  render();
}

els.headerSearch.addEventListener('input', onSearchInput);
els.heroSearch.addEventListener('input', onSearchInput);

els.heroForm.addEventListener('submit', (e) => {
  e.preventDefault();
  state.query = els.heroSearch.value;
  state.page = 1;
  syncSearchInputs(els.heroSearch);
  render();
  document.querySelector('.results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

els.categorySelect.addEventListener('change', () => {
  const value = els.categorySelect.value;
  state.categories = value ? new Set([value]) : new Set();
  state.page = 1;
  syncCategoryControls();
  render();
});

els.categoryFilters.addEventListener('change', (e) => {
  const input = e.target;
  if (input.type !== 'checkbox') return;
  if (input.checked) state.categories.add(input.value);
  else state.categories.delete(input.value);
  state.page = 1;
  els.categorySelect.value = state.categories.size === 1 ? [...state.categories][0] : '';
  render();
});

els.sortSelect.addEventListener('change', () => {
  state.sort = els.sortSelect.value;
  state.page = 1;
  render();
});

els.verifiedToggle.addEventListener('click', () => {
  state.verifiedOnly = !state.verifiedOnly;
  els.verifiedToggle.classList.toggle('on', state.verifiedOnly);
  els.verifiedToggle.setAttribute('aria-checked', String(state.verifiedOnly));
  state.page = 1;
  render();
});

function onPriceInput() {
  const min = parseFloat(els.priceMin.value);
  const max = parseFloat(els.priceMax.value);
  state.min = Number.isNaN(min) ? null : min;
  state.max = Number.isNaN(max) ? null : max;
  state.page = 1;
  render();
}
els.priceMin.addEventListener('input', onPriceInput);
els.priceMax.addEventListener('input', onPriceInput);

document.querySelectorAll('.trend-link').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.query = btn.dataset.query;
    state.categories = new Set();
    state.page = 1;
    syncSearchInputs(null);
    syncCategoryControls();
    render();
    document.querySelector('.results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

els.gridViewBtn.addEventListener('click', () => setView('grid'));
els.listViewBtn.addEventListener('click', () => setView('list'));

function setView(view) {
  state.view = view;
  els.gridViewBtn.classList.toggle('active', view === 'grid');
  els.listViewBtn.classList.toggle('active', view === 'list');
  els.gridViewBtn.setAttribute('aria-pressed', String(view === 'grid'));
  els.listViewBtn.setAttribute('aria-pressed', String(view === 'list'));
  render();
}

els.pagination.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-page]');
  if (!btn || btn.disabled) return;
  const value = btn.dataset.page;
  if (value === 'prev') state.page -= 1;
  else if (value === 'next') state.page += 1;
  else state.page = Number(value);
  render();
  document.querySelector('.results-head').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

els.grid.addEventListener('click', (e) => {
  const heart = e.target.closest('[data-heart]');
  if (heart) {
    const id = Number(heart.dataset.heart);
    if (state.wishlist.has(id)) state.wishlist.delete(id);
    else state.wishlist.add(id);
    heart.classList.toggle('active', state.wishlist.has(id));
    heart.setAttribute('aria-pressed', String(state.wishlist.has(id)));
    updateWishlistBadge();
    return;
  }
  if (e.target.closest('[data-contact]')) {
    go('plans');
    return;
  }
  if (e.target.closest('.supplier-name')) return;
  if (e.target.closest('.product-card')) go('productDetails');
});

els.notifBtn.addEventListener('click', () => toast('No new notifications.'));

const ROLE_PAGES = {
  buyer: '../Buyer%20Personal%20Profile/index.html',
  supplier: '../Supplier%20Profile/index.html',
};

els.roleSwitch.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-role]');
  if (!btn) return;
  window.location.href = ROLE_PAGES[btn.dataset.role];
});

els.newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  toast('Subscribed! Watch your inbox for wholesale deals.');
  els.newsletterForm.reset();
});

els.clearFilters.addEventListener('click', () => {
  state.query = '';
  state.categories = new Set();
  state.verifiedOnly = false;
  state.min = null;
  state.max = null;
  state.sort = 'relevant';
  state.page = 1;
  els.priceMin.value = '';
  els.priceMax.value = '';
  els.sortSelect.value = 'relevant';
  els.verifiedToggle.classList.remove('on');
  els.verifiedToggle.setAttribute('aria-checked', 'false');
  syncSearchInputs(null);
  syncCategoryControls();
  render();
});

/* ---------------- Init ---------------- */

if (SEARCH_PARAM) {
  syncSearchInputs(null);
  syncCategoryControls();
}

render();
updateWishlistBadge();
