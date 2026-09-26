/* EasyTrade — Marketing & Boosts page interactions */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- Toasts ---------- */
const ICONS = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
};

function toast(message, icon = 'check') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${ICONS[icon] || ICONS.check}<span>${message}</span>`;
  $('#toastStack').appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, 3200);
}

/* ---------- Boost cards -> Step 1 (body1) ---------- */
$$('[data-goto]').forEach((el) => {
  el.addEventListener('click', () => { location.href = el.dataset.goto; });
});

/* ---------- Sidebar navigation ---------- */
$$('.side-item[data-page]').forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    $$('.side-item').forEach((i) => i.classList.remove('active'));
    item.classList.add('active');
    if (item.dataset.page !== 'marketing') {
      toast(`"${item.textContent.trim()}" is not part of this demo page.`, 'info');
    }
  });
});

$('.switch-view').addEventListener('click', (e) => {
  e.preventDefault();
  toast('Switched to Buyer view (demo).');
});

/* ---------- Buyer / Supplier segmented control ---------- */
$$('#viewSeg .seg-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('#viewSeg .seg-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    toast(`Now viewing as ${btn.dataset.view}.`);
  });
});

/* ---------- Campaign row action menus ---------- */
const MENU_ICONS = {
  pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
};

let openMenu = null;

function closeMenus() {
  $$('.dropdown').forEach((m) => m.remove());
  $$('.menu-btn.open').forEach((b) => b.classList.remove('open'));
  openMenu = null;
}

function buildMenu(row, anchorCell) {
  closeMenus();
  const status = row.dataset.status;
  const menu = document.createElement('div');
  menu.className = 'dropdown';
  menu.innerHTML = `
    <button type="button" data-act="toggle">
      ${status === 'active' ? MENU_ICONS.pause : MENU_ICONS.play}
      ${status === 'active' ? 'Pause campaign' : 'Resume campaign'}
    </button>
    <button type="button" data-act="end" class="danger">
      ${MENU_ICONS.trash}
      End campaign
    </button>`;
  anchorCell.appendChild(menu);

  const btn = $('.menu-btn', anchorCell);
  btn.classList.add('open');
  openMenu = menu;

  menu.addEventListener('click', (e) => {
    const act = e.target.closest('button')?.dataset.act;
    if (act === 'toggle') toggleStatus(row);
    if (act === 'end') endCampaign(row);
    closeMenus();
  });
}

function toggleStatus(row) {
  const pill = $('.pill', row);
  const nowActive = row.dataset.status !== 'active';
  row.dataset.status = nowActive ? 'active' : 'paused';
  pill.className = `pill ${nowActive ? 'pill-green' : 'pill-gray'}`;
  pill.textContent = nowActive ? 'Active' : 'Paused';
  if (!nowActive) $('.camp-end', row).textContent = `Ended ${formatDate(new Date())}`;
  toast(nowActive ? `"${$('.camp-name', row).textContent}" is now active.` : `"${$('.camp-name', row).textContent}" was paused.`);
}

function endCampaign(row) {
  row.classList.add('removing');
  row.addEventListener('animationend', () => {
    row.remove();
    checkEmpty();
  }, { once: true });
  toast(`"${$('.camp-name', row).textContent}" ended.`, 'info');
}

/* Wire action cells (initial + dynamically added rows) */
function addActionCell(row) {
  const cell = $('.camp-action', row);
  cell.innerHTML = `
    <div class="menu-wrap">
      <button type="button" class="icon-btn menu-btn" aria-label="Campaign actions">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
      </button>
    </div>`;
  $('.menu-btn', cell).addEventListener('click', (e) => {
    e.stopPropagation();
    if (openMenu && openMenu.parentElement === cell) {
      closeMenus();
    } else {
      buildMenu(row, cell);
    }
  });
}

$$('#campaignBody tr').forEach(addActionCell);

document.addEventListener('click', (e) => {
  if (openMenu && !e.target.closest('.menu-wrap')) closeMenus();
});

/* ---------- Search filter ---------- */
$('#globalSearch').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  let visible = 0;
  $$('#campaignBody tr').forEach((row) => {
    const match = row.dataset.name.includes(q);
    row.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  checkEmpty(visible);
});

function checkEmpty(visibleCount) {
  const rows = $$('#campaignBody tr');
  const visible = visibleCount ?? rows.filter((r) => r.style.display !== 'none').length;
  $('#emptyState').hidden = visible !== 0;
}

/* ---------- View all campaigns ---------- */
let showingAll = false;
$('#viewAllBtn').addEventListener('click', () => {
  showingAll = !showingAll;
  $$('.extra-row').forEach((r) => { r.hidden = !showingAll; });
  $('#viewAllBtn').innerHTML = showingAll
    ? 'Show fewer campaigns <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>'
    : 'View all campaigns <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
});

/* ---------- Helpers ---------- */
function formatDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
