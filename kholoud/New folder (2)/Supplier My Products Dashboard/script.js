/* ============ EasyTrade — My Products ============ */

// ---------- Helpers ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

function formatPrice(value) {
  return "$" + Number(value).toFixed(2);
}

// Deterministic pseudo-random so the generated catalog is stable between loads
let seed = 20260921;
function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

// ---------- Catalog data ----------
const CATEGORY_META = {
  Electronics: { prefix: "EL", unit: "unit", hue: 200 },
  "Food & Beverage": { prefix: "FB", unit: "box", hue: 28 },
  Furniture: { prefix: "FR", unit: "unit", hue: 32 },
  Apparel: { prefix: "AP", unit: "piece", hue: 345 },
  "Home & Garden": { prefix: "HG", unit: "set", hue: 130 },
  Beauty: { prefix: "BT", unit: "unit", hue: 300 },
};

const NAME_BANK = {
  Electronics: [
    "Quantum Wireless Earbuds", "Nova Smart Watch", "VoltFast 65W Charger", "PixelView 4K Monitor",
    "AeroBook Laptop Stand", "Sonic Bluetooth Speaker", "Luma Ring Light Pro", "Titan Power Bank 20K",
  ],
  "Food & Beverage": [
    "Organic Green Tea Set", "Cold Brew Concentrate", "Himalayan Pink Salt 2kg", "Manuka Honey MGO 250",
    "Extra Virgin Olive Oil 5L", "Single Origin Dark Chocolate", "Premium Basmati Rice 10kg", "Ceremonial Matcha Powder",
  ],
  Furniture: [
    "Nordic Oak Desk", "Velvet Lounge Sofa", "Modular Shelf Unit", "Standing Desk Frame",
    "Marble Side Table", "Acoustic Desk Divider", "Rattan Lounge Chair", "Bamboo Monitor Riser",
  ],
  Apparel: [
    "Bamboo Crew Socks (12pk)", "Organic Cotton Tee", "Merino Wool Scarf", "Trail Running Shoes",
    "Linen Summer Shirt", "Recycled Fleece Hoodie", "Canvas Work Apron", "UV Shield Cap",
  ],
  "Home & Garden": [
    "Solar Path Lights (8pk)", "Self-Watering Planter", "Cordless Leaf Blower", "Heirloom Seed Kit",
    "Smart Thermostat", "Foldable Picnic Table", "Compost Bin 60L", "LED Grow Light Panel",
  ],
  Beauty: [
    "Vitamin C Serum 30ml", "Charcoal Detox Mask", "Argan Repair Shampoo", "Jade Facial Roller",
    "SPF50 Mineral Sunscreen", "Lavender Bath Salts", "Retinol Night Cream", "Tea Tree Body Wash",
  ],
};

function placeholderImg(category) {
  const hue = CATEGORY_META[category].hue;
  const letter = category.charAt(0);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>` +
    `<rect width='96' height='96' rx='12' fill='hsl(${hue},30%,93%)'/>` +
    `<text x='48' y='60' font-family='Arial,sans-serif' font-size='36' font-weight='700' ` +
    `fill='hsl(${hue},42%,40%)' text-anchor='middle'>${letter}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function buildCatalog() {
  const products = [
    {
      id: 1, name: "Lumix Z-40 Smartphone", sku: "PH-1002-LX", category: "Electronics",
      price: 450.0, unit: "unit", status: "published", stock: 64, moq: 10,
      img: "assets/products/pedestal.png",
      desc: "Next-gen flagship smartphone with a 6.7-inch OLED display and advanced triple camera system.",
    },
    {
      id: 2, name: "Artisan Coffee Beans", sku: "FB-9920-AC", category: "Food & Beverage",
      price: 12.5, unit: "bag", status: "published", stock: 320, moq: 25,
      img: "assets/products/coffee.png",
      desc: "Single-origin medium-roast arabica with notes of caramel and cocoa. 1 kg whole-bean bags.",
    },
    {
      id: 3, name: "ErgoPro Office Chair", sku: "FR-5561-EP", category: "Furniture",
      price: 89.0, unit: "unit", status: "draft", stock: 0, moq: 5,
      img: "assets/products/chair.png",
      desc: "Ergonomic mesh office chair with adjustable lumbar support and a 360° swivel base.",
    },
  ];

  const categories = Object.keys(CATEGORY_META);
  let nameCursor = 0;

  for (let i = 0; i < 121; i++) {
    const category = categories[Math.floor(rnd() * categories.length)];
    const meta = CATEGORY_META[category];
    const name = NAME_BANK[category][nameCursor++ % NAME_BANK[category].length];
    const price = Math.round((4.9 + rnd() * 395) * 2) / 2; // .00 or .50 increments
    const moq = [5, 10, 10, 20, 25, 50][Math.floor(rnd() * 6)];
    const isDraft = i % 24 === 10; // exactly 5 generated drafts -> 6 total with the chair
    const outOfStock = !isDraft && i % 17 === 6;

    products.push({
      id: products.length + 1,
      name,
      sku: `${meta.prefix}-${1000 + i * 7}-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i * 7) % 26))}`,
      category,
      price,
      unit: meta.unit,
      status: isDraft ? "draft" : "published",
      stock: outOfStock ? 0 : 20 + Math.floor(rnd() * 480),
      moq,
      img: placeholderImg(category),
      desc: `${name} — wholesale ${category.toLowerCase()} listing. Minimum order ${moq} ${meta.unit}s, ready for bulk shipping.`,
    });
  }
  return products;
}

const products = buildCatalog();

// ---------- State ----------
const state = {
  tab: "all",
  query: "",
  page: 1,
  pageSize: 3,
  selectedId: null,
  pendingImage: null,
};

// ---------- Filtering & pagination ----------
function badgeState(p) {
  if (p.status === "draft") return "draft";
  if (p.stock === 0) return "outofstock";
  return "published";
}

function matchesTab(p) {
  switch (state.tab) {
    case "published": return p.status === "published";
    case "draft": return p.status === "draft";
    case "outofstock": return p.status === "published" && p.stock === 0;
    default: return true;
  }
}

function matchesQuery(p) {
  if (!state.query) return true;
  const q = state.query.toLowerCase();
  return (
    p.name.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}

function getFiltered() {
  return products.filter((p) => matchesTab(p) && matchesQuery(p));
}

function tabCounts() {
  return {
    all: products.length,
    published: products.filter((p) => p.status === "published").length,
    drafts: products.filter((p) => p.status === "draft").length,
    outofstock: products.filter((p) => p.status === "published" && p.stock === 0).length,
  };
}

// ---------- Rendering ----------
const rowsEl = $("#productRows");
const showingEl = $("#showingText");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");

const EDIT_SVG =
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">` +
  `<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"></path></svg>`;

const MANAGE_URL = "../easytrade-products/index.html";

function renderTabs() {
  const counts = tabCounts();
  $("#countAll").textContent = `(${counts.all})`;
  $("#countPublished").textContent = `(${counts.published})`;
  $("#countDrafts").textContent = `(${counts.drafts})`;
  $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === state.tab));
}

function renderRows() {
  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  state.page = Math.min(Math.max(1, state.page), totalPages);

  const start = (state.page - 1) * state.pageSize;
  const pageItems = filtered.slice(start, start + state.pageSize);

  if (pageItems.length === 0) {
    rowsEl.innerHTML = `<div class="empty-row">No products match your current filters.</div>`;
  } else {
    rowsEl.innerHTML = pageItems
      .map((p) => {
        const b = badgeState(p);
        const badgeLabel =
          b === "outofstock" ? "Out of Stock" : b.charAt(0).toUpperCase() + b.slice(1);
        const selectedClass = p.id === state.selectedId ? " row-selected" : "";
        return (
          `<div class="product-row${selectedClass}" data-id="${p.id}">` +
          `<div class="cell-details">` +
          `<a class="product-link" href="${MANAGE_URL}" title="Open in Manage Products"><div class="thumb"><img src="${p.img}" alt="${esc(p.name)}" /></div></a>` +
          `<div class="details-text">` +
          `<a class="product-link" href="${MANAGE_URL}" title="Open in Manage Products"><div class="details-name">${esc(p.name)}</div></a>` +
          `<div class="details-sku">SKU: ${esc(p.sku)}</div>` +
          `</div></div>` +
          `<div class="cell-category">${esc(p.category)}</div>` +
          `<div class="cell-price">${formatPrice(p.price)}<span class="unit">/ ${esc(p.unit)}</span></div>` +
          `<div class="cell-status"><span class="badge ${b}">${badgeLabel}</span></div>` +
          `<div class="cell-actions">` +
          `<button type="button" class="row-edit-btn" data-edit="${p.id}" title="Quick edit">${EDIT_SVG}</button>` +
          `</div></div>`
        );
      })
      .join("");
  }

  const end = Math.min(start + pageItems.length, filtered.length);
  showingEl.textContent =
    filtered.length === 0
      ? "Showing 0 of 0 products"
      : `Showing ${start + 1}-${end} of ${filtered.length} products`;

  prevBtn.disabled = state.page <= 1;
  nextBtn.disabled = state.page >= totalPages;
}

function render() {
  renderTabs();
  renderRows();
}

// ---------- Quick edit panel ----------
const contentGrid = $("#contentGrid");
const editPanel = $("#editPanel");
const editForm = $("#editForm");
const editImageBox = $("#editImageBox");
const editImagePreview = $("#editImagePreview");
const editTitle = $("#editTitle");
const editCategory = $("#editCategory");
const editPrice = $("#editPrice");
const editMoq = $("#editMoq");
const editDesc = $("#editDesc");
const imageInput = $("#imageInput");

function populateCategorySelect() {
  editCategory.innerHTML = Object.keys(CATEGORY_META)
    .map((c) => `<option value="${esc(c)}">${esc(c)}</option>`)
    .join("");
}

function selectedProduct() {
  return products.find((p) => p.id === state.selectedId) || null;
}

function fillForm(p) {
  if (!p) return;
  editTitle.value = p.name;
  editCategory.value = p.category;
  editPrice.value = Number(p.price).toFixed(2);
  editMoq.value = p.moq;
  editDesc.value = p.desc;
  state.pendingImage = null;
  editImagePreview.src = p.img;
}

function openEdit(id) {
  state.selectedId = id;
  contentGrid.classList.remove("no-panel");
  fillForm(selectedProduct());
  renderRows();
}

function closePanel() {
  state.selectedId = null;
  state.pendingImage = null;
  contentGrid.classList.add("no-panel");
  renderRows();
}

// ---------- Toast ----------
const toastEl = $("#toast");
let toastTimer = null;

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

// ---------- Events ----------
$("#tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  state.tab = tab.dataset.tab;
  state.page = 1;
  render();
});

prevBtn.addEventListener("click", () => {
  if (state.page > 1) {
    state.page--;
    renderRows();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.max(1, Math.ceil(getFiltered().length / state.pageSize));
  if (state.page < totalPages) {
    state.page++;
    renderRows();
  }
});

$("#searchInput").addEventListener("input", (e) => {
  state.query = e.target.value.trim();
  state.page = 1;
  renderRows();
});

rowsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-edit]");
  if (!btn) return;
  openEdit(Number(btn.dataset.edit));
});

$("#closePanelBtn").addEventListener("click", closePanel);

editImageBox.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.pendingImage = reader.result;
    editImagePreview.src = reader.result;
  };
  reader.readAsDataURL(file);
  imageInput.value = "";
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const p = selectedProduct();
  if (!p) return;

  const title = editTitle.value.trim();
  const price = parseFloat(editPrice.value);
  const moq = parseInt(editMoq.value, 10);
  if (!title || isNaN(price) || price < 0 || isNaN(moq) || moq < 1) {
    toast("Please fill in valid listing details");
    return;
  }

  p.name = title;
  p.category = editCategory.value;
  p.price = Math.round(price * 100) / 100;
  p.unit = CATEGORY_META[p.category].unit;
  p.moq = moq;
  p.desc = editDesc.value.trim();
  if (state.pendingImage) {
    p.img = state.pendingImage;
    state.pendingImage = null;
  }

  render();
  toast("Changes saved");
});

$("#discardBtn").addEventListener("click", () => {
  fillForm(selectedProduct());
  toast("Changes discarded");
});

// Role toggle (top bar)
const roleToggle = $("#roleToggle");
function setRole(role) {
  $$(".role-btn").forEach((b) => b.classList.toggle("active", b.dataset.role === role));
  toast(role === "buyer" ? "Switched to Buyer view" : "Switched to Supplier view");
}
roleToggle.addEventListener("click", (e) => {
  const btn = e.target.closest(".role-btn");
  if (btn) setRole(btn.dataset.role);
});

// ---------- Init ----------
populateCategorySelect();
render();
openEdit(products[0].id); // pre-select first listing, as in the design
