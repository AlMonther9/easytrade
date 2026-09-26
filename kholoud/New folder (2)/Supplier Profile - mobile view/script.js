const PRODUCTS = [
  { name: 'Premium Organic Cotton', price: '$12.50 / yard', moq: 'Min. Order: 500 yards', category: 'Cotton', img: 'assets/product-cotton.svg' },
  { name: 'Heavy-Duty Canvas', price: '$8.75 / yard', moq: 'Min. Order: 200 yards', category: 'Canvas', img: 'assets/product-canvas.png' },
  { name: 'Egyptian Linen Blend', price: '$15.20 / yard', moq: 'Min. Order: 100 yards', category: 'Linen', img: 'assets/product-linen.png' },
  { name: 'Recycled Denim Fabric', price: '$9.90 / yard', moq: 'Min. Order: 100 yards', category: 'Denim', img: 'assets/product-denim.png' },
];

const CATEGORIES = ['All Fabrics', 'Cotton', 'Canvas', 'Linen', 'Denim'];

const state = { category: 'All Fabrics', query: '' };

const els = {
  list: document.getElementById('productList'),
  empty: document.getElementById('emptyState'),
  search: document.getElementById('searchInput'),
  filterBtn: document.getElementById('filterBtn'),
  filterMenu: document.getElementById('filterMenu'),
  filterLabel: document.getElementById('filterLabel'),
  topbar: document.getElementById('topbar'),
  favBtn: document.getElementById('favBtn'),
  alertBtn: document.getElementById('alertBtn'),
  alertDot: document.getElementById('alertDot'),
  backdrop: document.getElementById('modalBackdrop'),
  modalClose: document.getElementById('modalClose'),
  form: document.getElementById('contactForm'),
  toast: document.getElementById('toast'),
};

function cardHTML(product, index) {
  return `
    <article class="card product" style="animation-delay:${index * 60}ms">
      <div class="product-media"><img class="product-img" src="${product.img}" alt="${product.name} fabric placeholder" /></div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        <p class="moq">${product.moq}</p>
        <div class="product-foot">
          <span class="p-loc"><img src="assets/icon-pin.png" alt="" /> Cairo</span>
          <span class="p-resp">Response: 98%</span>
        </div>
      </div>
    </article>`;
}

function render() {
  const query = state.query.trim().toLowerCase();
  const items = PRODUCTS.filter((p) => {
    const inCategory = state.category === 'All Fabrics' || p.category === state.category;
    const inQuery = !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    return inCategory && inQuery;
  });
  els.list.innerHTML = items.map(cardHTML).join('');
  els.empty.hidden = items.length !== 0;
}

function buildFilterMenu() {
  els.filterMenu.innerHTML = CATEGORIES.map(
    (c) => `<button type="button" role="menuitem" data-category="${c}" class="${c === state.category ? 'active' : ''}">${c}</button>`
  ).join('');
}

function setCategory(category) {
  state.category = category;
  els.filterLabel.textContent = category === 'All Fabrics' ? 'Filter' : category;
  els.filterBtn.classList.toggle('active', category !== 'All Fabrics');
  els.filterMenu.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.category === category));
  render();
}

function toggleFilterMenu(open) {
  const willOpen = open ?? els.filterMenu.hidden;
  els.filterMenu.hidden = !willOpen;
  els.filterBtn.setAttribute('aria-expanded', String(willOpen));
}

let toastTimer;
function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
}

function openModal() {
  els.backdrop.hidden = false;
  els.form.elements.name.focus();
}

function closeModal() {
  els.backdrop.hidden = true;
}

function countUp(el) {
  const target = Number(el.dataset.count);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = target;
    return;
  }
  const duration = 900;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

els.search.addEventListener('input', () => {
  state.query = els.search.value;
  render();
});

els.filterBtn.addEventListener('click', () => toggleFilterMenu());

els.filterMenu.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  setCategory(button.dataset.category);
  toggleFilterMenu(false);
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.filter-wrap')) toggleFilterMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  toggleFilterMenu(false);
  closeModal();
});

document.querySelectorAll('[data-contact]').forEach((button) => button.addEventListener('click', openModal));

els.modalClose.addEventListener('click', closeModal);

els.backdrop.addEventListener('click', (event) => {
  if (event.target === els.backdrop) closeModal();
});

els.form.addEventListener('submit', (event) => {
  event.preventDefault();
  closeModal();
  els.form.reset();
  toast('Inquiry sent — Apex Textiles Co. will reply within 24h.');
});

els.favBtn.addEventListener('click', () => {
  const active = els.favBtn.classList.toggle('active');
  toast(active ? 'Apex Textiles Co. added to favorites.' : 'Removed from favorites.');
});

els.alertBtn.addEventListener('click', () => {
  els.alertDot.hidden = true;
  toast("You're all caught up — no new notifications.");
});

window.addEventListener('scroll', () => {
  els.topbar.classList.toggle('scrolled', window.scrollY > 4);
}, { passive: true });

buildFilterMenu();
render();
document.querySelectorAll('[data-count]').forEach(countUp);
