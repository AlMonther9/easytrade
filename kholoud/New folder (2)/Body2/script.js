const VAT_RATE = 0.14;

const formatEGP = (amount) => `EGP ${amount.toFixed(2)}`;

// Promotional headline character counter
const headlineInput = document.getElementById('headlineInput');
const charCount = document.getElementById('charCount');

headlineInput.addEventListener('input', () => {
  charCount.textContent = headlineInput.value.length;
});

// Boost duration selection -> keep the order summary in sync
const options = document.querySelectorAll('.duration-option');
const summaryDuration = document.getElementById('summaryDuration');
const packagePrice = document.getElementById('packagePrice');
const vatAmount = document.getElementById('vatAmount');
const totalAmount = document.getElementById('totalAmount');

function renderSummary(option) {
  const price = Number(option.dataset.price);
  const vat = price * VAT_RATE;

  summaryDuration.textContent = option.dataset.duration;
  packagePrice.textContent = formatEGP(price);
  vatAmount.textContent = formatEGP(vat);
  totalAmount.textContent = formatEGP(price + vat);
}

options.forEach((option) => {
  option.addEventListener('click', () => {
    options.forEach((o) => o.classList.remove('selected'));
    option.classList.add('selected');
    renderSummary(option);
  });
});

// Buyer / Supplier role switch
const roleButtons = document.querySelectorAll('.role-btn');
roleButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    roleButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Activate boost -> confirmation toast, then back to the boosts page
const activateBtn = document.getElementById('activateBtn');
const toast = document.getElementById('toast');

// Show the product picked in Step 1 (body1), if any
const picked = JSON.parse(localStorage.getItem('et-selected-product') || 'null');
if (picked) {
  document.querySelector('.product-name').textContent = picked.name;
  document.querySelector('.product-id').textContent = `ID: ${picked.sku}`;
}

activateBtn.addEventListener('click', () => {
  toast.classList.add('show');
  setTimeout(() => { window.location.href = '../Body/index.html'; }, 1600);
});
