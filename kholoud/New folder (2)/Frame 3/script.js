const PAGE_SIZE = 4;

let products = [
  { id: 1, name: "Premium Cotton T-Shirts", sku: "ET-1092-CT", price: 150, stock: 100, status: "Published", image: "assets/product-blue-1.png" },
  { id: 2, name: "Organic Linen Shirt", sku: "ET-2210-LN", price: 250, stock: 45, status: "Published", image: "assets/product-gray.png" },
  { id: 3, name: "Classic Denim Jacket", sku: "ET-4402-DM", price: 450, stock: 12, status: "Draft", image: "assets/product-yellow.png" },
  { id: 4, name: "Pure Silk Scarf", sku: "ET-5112-SK", price: 120, stock: 0, status: "Out of Stock", image: "assets/product-blue-2.png" },
  { id: 5, name: "Wool Blend Coat", sku: "ET-6301-WB", price: 890, stock: 8, status: "Published", image: "assets/product-gray.png" },
  { id: 6, name: "Slim Fit Chinos", sku: "ET-1455-CH", price: 320, stock: 60, status: "Published", image: "assets/product-blue-1.png" },
  { id: 7, name: "Leather Belt", sku: "ET-7820-LB", price: 180, stock: 25, status: "Draft", image: "assets/product-yellow.png" },
  { id: 8, name: "Summer Polo Pack", sku: "ET-3390-PL", price: 210, stock: 0, status: "Out of Stock", image: "assets/product-blue-2.png" },
  { id: 9, name: "Quilted Puffer Vest", sku: "ET-9044-PV", price: 540, stock: 14, status: "Published", image: "assets/product-yellow.png" },
  { id: 10, name: "Merino Wool Socks", sku: "ET-2218-MW", price: 60, stock: 200, status: "Published", image: "assets/product-gray.png" },
  { id: 11, name: "Tailored Blazer", sku: "ET-8710-BZ", price: 720, stock: 5, status: "Draft", image: "assets/product-blue-1.png" },
  { id: 12, name: "Kids Denim Overalls", sku: "ET-5527-DO", price: 260, stock: 30, status: "Published", image: "assets/product-blue-2.png" },
];

let currentPage = 1;
let searchQuery = "";
let editingId = null;
let nextId = 13;

const tableBody = document.getElementById("tableBody");
const pager = document.getElementById("pager");
const showingText = document.getElementById("showingText");
const pageTitle = document.getElementById("pageTitle");
const searchInput = document.getElementById("searchInput");
const backdrop = document.getElementById("modalBackdrop");
const form = document.getElementById("productForm");
const modalTitle = document.getElementById("modalTitle");
const toast = document.getElementById("toast");

const badgeClass = {
  "Published": "published",
  "Draft": "draft",
  "Out of Stock": "out-of-stock",
};

function filteredProducts() {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  );
}

function render() {
  const list = filteredProducts();
  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  if (currentPage > pageCount) currentPage = pageCount;

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = list.slice(start, start + PAGE_SIZE);

  pageTitle.textContent = `Inventory List (${products.length} Products)`;

  if (pageItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:40px">No products found.</td></tr>`;
  } else {
    tableBody.innerHTML = pageItems
      .map(
        (p) => `
      <tr>
        <td><img class="product-thumb" src="${p.image}" alt=""></td>
        <td>
          <div class="product-name">${escapeHtml(p.name)}</div>
          <div class="product-sku">SKU: ${escapeHtml(p.sku)}</div>
        </td>
        <td>EGP ${p.price} / unit</td>
        <td>${p.stock} units</td>
        <td><span class="badge ${badgeClass[p.status]}">${p.status}</span></td>
        <td>
          <div class="row-actions">
            <button type="button" class="action-btn" data-edit="${p.id}" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </button>
            <button type="button" class="action-btn delete" data-delete="${p.id}" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>`
      )
      .join("");
  }

  const from = list.length === 0 ? 0 : start + 1;
  const to = Math.min(start + PAGE_SIZE, list.length);
  showingText.textContent = `Showing ${from} to ${to} of ${list.length} products`;

  renderPager(pageCount);
}

function renderPager(pageCount) {
  let html = `<button type="button" class="page-btn nav" data-page="prev" ${currentPage === 1 ? "disabled" : ""}>Previous</button>`;
  for (let i = 1; i <= pageCount; i++) {
    html += `<button type="button" class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }
  html += `<button type="button" class="page-btn nav" data-page="next" ${currentPage === pageCount ? "disabled" : ""}>Next</button>`;
  pager.innerHTML = html;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function openModal(product) {
  editingId = product ? product.id : null;
  modalTitle.textContent = product ? "Edit Product" : "Add New Product";
  document.getElementById("fieldName").value = product ? product.name : "";
  document.getElementById("fieldSku").value = product ? product.sku : "";
  document.getElementById("fieldPrice").value = product ? product.price : "";
  document.getElementById("fieldStock").value = product ? product.stock : "";
  document.getElementById("fieldStatus").value = product ? product.status : "Published";
  document.getElementById("fieldImage").value = product ? product.image : "assets/product-blue-1.png";
  backdrop.hidden = false;
  document.getElementById("fieldName").focus();
}

function closeModal() {
  backdrop.hidden = true;
  form.reset();
  editingId = null;
}

pager.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-page]");
  if (!btn || btn.disabled) return;
  const page = btn.dataset.page;
  const pageCount = Math.max(1, Math.ceil(filteredProducts().length / PAGE_SIZE));
  if (page === "prev") currentPage = Math.max(1, currentPage - 1);
  else if (page === "next") currentPage = Math.min(pageCount, currentPage + 1);
  else currentPage = Number(page);
  render();
});

tableBody.addEventListener("click", (e) => {
  const editBtn = e.target.closest("[data-edit]");
  const deleteBtn = e.target.closest("[data-delete]");

  if (editBtn) {
    const product = products.find((p) => p.id === Number(editBtn.dataset.edit));
    if (product) openModal(product);
  }

  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.delete);
    const product = products.find((p) => p.id === id);
    if (product && confirm(`Delete "${product.name}"?`)) {
      products = products.filter((p) => p.id !== id);
      render();
      showToast("Product deleted");
    }
  }
});

document.getElementById("addProductBtn").addEventListener("click", () => openModal(null));
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalCancel").addEventListener("click", closeModal);

backdrop.addEventListener("click", (e) => {
  if (e.target === backdrop) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !backdrop.hidden) closeModal();
});

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  currentPage = 1;
  render();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById("fieldName").value.trim(),
    sku: document.getElementById("fieldSku").value.trim(),
    price: Number(document.getElementById("fieldPrice").value),
    stock: Number(document.getElementById("fieldStock").value),
    status: document.getElementById("fieldStatus").value,
    image: document.getElementById("fieldImage").value,
  };

  if (editingId !== null) {
    const product = products.find((p) => p.id === editingId);
    Object.assign(product, data);
    showToast("Product updated");
  } else {
    products.unshift({ id: nextId++, ...data });
    currentPage = 1;
    showToast("Product added");
  }

  closeModal();
  render();
});

render();
