const PAGE_SIZE = 4;
const STATUSES = { in: "In Stock", out: "Out of Stock", draft: "Draft" };

let products = [
  { id: 1, name: "Industrial Drill Bit Set", category: "Hardware & Tools", price: "EGP 245.00", status: "in" },
  { id: 2, name: "Wholesale Cotton Fabric",  category: "Textiles",          price: "$12.50 / yard", status: "draft" },
  { id: 3, name: "Solar Powered Outdoor Lamp", category: "Electronics",      price: "$89.99", status: "out" },
  { id: 4, name: "Eco-friendly Bamboo Utensils", category: "Kitchenware",    price: "$5.25", status: "in" },
];
for (let i = 5; i <= 42; i++) {
  const idx = i - 5;
  products.push({
    id: i,
    name: "Sample Product " + i,
    category: ["Hardware & Tools", "Textiles", "Electronics", "Kitchenware"][i % 4],
    price: "$" + (i * 3.5 + 1).toFixed(2),
    status: idx < 36 ? "in" : idx === 36 ? "draft" : "out",
  });
}

let page = 1;
let query = "";
let editingId = null;

const body = document.getElementById("productsBody");
const showingText = document.getElementById("showingText");
const statTotal = document.getElementById("statTotal");
const statActive = document.getElementById("statActive");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const backdrop = document.getElementById("modalBackdrop");
const form = document.getElementById("productForm");

const ICON_EDIT = '<svg viewBox="0 0 24 24" class="icon"><path d="M4 20l1-4L16 5l3 3L8 19l-4 1z"/><line x1="14" y1="7" x2="17" y2="10"/></svg>';
const ICON_TRASH = '<svg viewBox="0 0 24 24" class="icon"><rect x="5" y="7" width="14" height="13" rx="2"/><line x1="4" y1="7" x2="20" y2="7"/><path d="M10 7V4h4v3"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';
const ICON_IMG = '<svg viewBox="0 0 24 24" class="icon"><rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><polyline points="5 17 10 13 13 15 17 11 19 13"/></svg>';
const ICON_VIEW = '<svg viewBox="0 0 24 24" class="icon"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.6"/></svg>';

/* The three My Products screens link to each other. */
const INVENTORY_URL = "../Frame 3/index.html";

function filtered() {
  if (!query) return products;
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
}

function render() {
  const list = filtered();
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  page = Math.min(page, pages);
  const start = (page - 1) * PAGE_SIZE;
  const slice = list.slice(start, start + PAGE_SIZE);

  body.innerHTML = slice.length ? slice.map(p => `
    <tr>
      <td><div class="product-cell"><span class="thumb">${ICON_IMG}</span><a class="product-link" href="${INVENTORY_URL}" title="Open in Inventory List"><strong>${escapeHtml(p.name)}</strong></a></div></td>
      <td class="category">${escapeHtml(p.category)}</td>
      <td class="price">${escapeHtml(p.price)}</td>
      <td><span class="badge badge-${p.status}">${STATUSES[p.status]}</span></td>
      <td>
        <div class="row-actions">
          <a href="${INVENTORY_URL}" title="Open in Inventory List">${ICON_VIEW}</a>
          <button data-edit="${p.id}" title="Edit">${ICON_EDIT}</button>
          <button data-del="${p.id}" title="Delete">${ICON_TRASH}</button>
        </div>
      </td>
    </tr>`).join("")
    : `<tr class="empty-row"><td colspan="5">No products match "${escapeHtml(query)}"</td></tr>`;

  showingText.textContent = `Showing ${slice.length} of ${list.length} products`;
  statTotal.textContent = products.length;
  statActive.textContent = products.filter(p => p.status === "in").length;
  prevBtn.disabled = page <= 1;
  nextBtn.disabled = page >= pages;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

body.addEventListener("click", e => {
  const editBtn = e.target.closest("[data-edit]");
  const delBtn = e.target.closest("[data-del]");
  if (delBtn) {
    const id = Number(delBtn.dataset.del);
    if (confirm("Delete this product?")) {
      products = products.filter(p => p.id !== id);
      render();
    }
  } else if (editBtn) {
    const p = products.find(x => x.id === Number(editBtn.dataset.edit));
    editingId = p.id;
    document.getElementById("modalTitle").textContent = "Edit Product";
    form.fName.value = p.name;
    form.fCategory.value = p.category;
    form.fPrice.value = p.price;
    form.fStatus.value = p.status;
    openModal();
  }
});

document.getElementById("productSearch").addEventListener("input", e => {
  query = e.target.value.trim();
  page = 1;
  render();
});

prevBtn.addEventListener("click", () => { page--; render(); });
nextBtn.addEventListener("click", () => { page++; render(); });

function openModal() { backdrop.classList.remove("hidden"); form.fName.focus(); }
function closeModal() { backdrop.classList.add("hidden"); editingId = null; form.reset(); }

document.getElementById("addProductBtn").addEventListener("click", () => {
  document.getElementById("modalTitle").textContent = "Add New Product";
  openModal();
});
document.getElementById("cancelModal").addEventListener("click", closeModal);
backdrop.addEventListener("click", e => { if (e.target === backdrop) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

form.addEventListener("submit", e => {
  e.preventDefault();
  const data = {
    name: form.fName.value.trim(),
    category: form.fCategory.value,
    price: form.fPrice.value.trim(),
    status: form.fStatus.value,
  };
  if (!data.name || !data.price) return;
  if (editingId) {
    Object.assign(products.find(p => p.id === editingId), data);
  } else {
    products.unshift({ id: Date.now(), ...data });
    page = 1;
  }
  closeModal();
  render();
});

document.querySelectorAll("#roleSwitch .role-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#roleSwitch .role-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

render();
