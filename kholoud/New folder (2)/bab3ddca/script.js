const products = [
  {
    id: "TS-001",
    name: "Premium Cotton T-Shirts",
    sku: "TS-001",
    stock: 142,
    icon: "assets/icon-blue.png",
  },
  {
    id: "TR-042",
    name: "Organic Linen Trousers",
    sku: "TR-042",
    stock: 89,
    icon: "assets/icon-gray.png",
  },
  {
    id: "HD-089",
    name: "Recycled Polyester Hoodies",
    sku: "HD-089",
    stock: 215,
    icon: "assets/icon-purple.png",
  },
  {
    id: "SK-112",
    name: "Bamboo Fiber Socks",
    sku: "SK-112",
    stock: 540,
    icon: "assets/icon-yellow.png",
  },
];

let selectedId = "TS-001";

const productList = document.getElementById("product-list");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const continueBtn = document.getElementById("continue-btn");
const closeBtn = document.getElementById("close-btn");
const overlay = document.getElementById("overlay");

function renderProducts(filter = "") {
  const query = filter.trim().toLowerCase();
  const visible = products.filter((p) =>
    `${p.name} ${p.sku}`.toLowerCase().includes(query)
  );

  productList.innerHTML = "";
  emptyState.hidden = visible.length > 0;

  visible.forEach((product) => {
    const li = document.createElement("li");
    li.className = "product" + (product.id === selectedId ? " selected" : "");
    li.setAttribute("role", "radio");
    li.setAttribute("aria-checked", product.id === selectedId);
    li.tabIndex = 0;
    li.dataset.id = product.id;

    li.innerHTML = `
      <img class="product__icon" src="${product.icon}" alt="" />
      <div class="product__info">
        <p class="product__name">${product.name}</p>
        <p class="product__meta">SKU: ${product.sku} · ${product.stock} in stock</p>
      </div>
      <span class="product__radio" aria-hidden="true"></span>
    `;

    li.addEventListener("click", () => selectProduct(product.id));
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectProduct(product.id);
      }
    });

    productList.appendChild(li);
  });
}

function selectProduct(id) {
  selectedId = id;
  renderProducts(searchInput.value);
}

searchInput.addEventListener("input", (e) => renderProducts(e.target.value));

continueBtn.addEventListener("click", () => {
  const product = products.find((p) => p.id === selectedId);
  if (!product) return;
  console.log("Boosting product:", product);
  alert(
    `Continue to Boost Details\n\nProduct: ${product.name}\nSKU: ${product.sku}\nHot Deal: EGP 250 / week · 7 days`
  );
});

closeBtn.addEventListener("click", () => overlay.classList.add("hidden"));

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.classList.add("hidden");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") overlay.classList.add("hidden");
});

renderProducts();
searchInput.focus();
