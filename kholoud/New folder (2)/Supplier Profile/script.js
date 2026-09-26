// Grid / list view toggle
const productGrid = document.getElementById('productGrid');
document.querySelectorAll('.view-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.view-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    productGrid.classList.toggle('list-view', btn.dataset.view === 'list');
  });
});

// Favorite hearts
document.querySelectorAll('.fav').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.setAttribute('aria-label', btn.classList.contains('active') ? 'Remove from favorites' : 'Save to favorites');
  });
});

// Pagination
document.querySelectorAll('.pagination .page').forEach((page) => {
  page.addEventListener('click', () => {
    document.querySelectorAll('.pagination .page').forEach((p) => p.classList.remove('active'));
    page.classList.add('active');
  });
});

// Buyer / Supplier role switch
const ROLE_PAGES = {
  buyer: '../Buyer%20Personal%20Profile/index.html',
  supplier: 'index.html',
};

document.getElementById('roleSwitch').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-role]');
  if (!btn) return;
  window.location.href = ROLE_PAGES[btn.dataset.role];
});

// Filter popover
const filterWrap = document.getElementById('filterWrap');
document.getElementById('filterBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  filterWrap.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!filterWrap.contains(e.target)) filterWrap.classList.remove('open');
});

// Filtering
const cards = [...document.querySelectorAll('.product-card')];
const emptyState = document.getElementById('emptyState');
const filterInputs = [...document.querySelectorAll('.filter-panel input[type="checkbox"]')];

function applyFilters() {
  const checked = filterInputs.filter((i) => i.checked).map((i) => i.value);
  if (!checked.length) {
    cards.forEach((c) => (c.style.display = ''));
    emptyState.classList.remove('show');
    return;
  }
  let visible = 0;
  cards.forEach((card) => {
    const tags = (card.dataset.tags || '').split(' ');
    const match = tags.some((t) => checked.includes(t));
    card.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  emptyState.classList.toggle('show', visible === 0);
}

filterInputs.forEach((input) => input.addEventListener('change', applyFilters));
document.getElementById('clearFilters').addEventListener('click', () => {
  filterInputs.forEach((i) => (i.checked = false));
  applyFilters();
});

// Contact toast
const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}
document.querySelectorAll('[data-contact]').forEach((btn) => {
  btn.addEventListener('click', () => showToast(btn.dataset.contact));
});

document.getElementById('notifBtn').addEventListener('click', () => showToast('No new notifications.'));
