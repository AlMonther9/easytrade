const PRODUCTS = [
  { id:"ts-001", name:"Premium Cotton T-Shirts", sku:"TS-001", stock:142, tint:"#bfe3f7" },
  { id:"tr-042", name:"Organic Linen Trousers",  sku:"TR-042", stock:89,  tint:"#dfe5ea" },
  { id:"hd-089", name:"Recycled Polyester Hoodies", sku:"HD-089", stock:215, tint:"#d9def9" },
  { id:"sk-112", name:"Bamboo Fiber Socks",      sku:"SK-112", stock:540, tint:"#fbe0bd" },
];

const DEAL = { price:250, duration:7 };

const BOX_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 8.5h16v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z"/>
  <path d="M6.5 8.5V6A1.5 1.5 0 0 1 8 4.5h8A1.5 1.5 0 0 1 17.5 6v2.5"/>
  <path d="M10.5 14h3"/>
</svg>`;

const $ = (id) => document.getElementById(id);
const listEl = $("products");

let selectedId = null;

function render(filter = "") {
  const q = filter.trim().toLowerCase();
  const items = PRODUCTS.filter(p =>
    !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  );

  listEl.innerHTML = items.map(p => `
    <li>
      <label class="product${p.id === selectedId ? " is-selected" : ""}" style="--tint:${p.tint}" data-id="${p.id}">
        <span class="product__icon">${BOX_ICON}</span>
        <span class="product__text">
          <span class="product__name">${p.name}</span>
          <span class="product__meta">SKU: ${p.sku} &middot; ${p.stock} in stock</span>
        </span>
        <input class="radio" type="radio" name="product" value="${p.id}" ${p.id === selectedId ? "checked" : ""} />
        <span class="product__radio" aria-hidden="true"></span>
      </label>
    </li>`).join("");

  $("empty").hidden = items.length > 0;
}

listEl.addEventListener("change", (e) => {
  if (e.target.type !== "radio") return;
  selectedId = e.target.value;
  listEl.querySelectorAll(".product").forEach(li =>
    li.classList.toggle("is-selected", li.dataset.id === selectedId)
  );
  $("continueBtn").disabled = false;
});

$("searchInput").addEventListener("input", (e) => render(e.target.value));

$("continueBtn").addEventListener("click", () => {
  const picked = PRODUCTS.find(p => p.id === selectedId);
  if (!picked) return;
  localStorage.setItem("et-selected-product", JSON.stringify({ ...picked, ...DEAL }));
  window.location.href = "../Body2/index.html";
});

$("closeBtn").addEventListener("click", () => {
  window.location.href = "../Body/index.html";
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("overlay").hidden) $("closeBtn").click();
});

$("price").textContent = DEAL.price;
$("duration").textContent = DEAL.duration;
$("continueBtn").disabled = true;
render();
