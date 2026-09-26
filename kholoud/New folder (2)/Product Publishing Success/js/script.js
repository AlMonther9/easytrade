const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const toast = $('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

function spawnRipple(event, element) {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  element.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('is-loaded');
});

/* Buyer / Supplier segmented toggle */
const roleToggle = $('.role-toggle');
$$('.role', roleToggle).forEach((button) => {
  button.addEventListener('click', () => {
    if (button.classList.contains('is-active')) return;
    $$('.role', roleToggle).forEach((b) => b.classList.toggle('is-active', b === button));
    roleToggle.dataset.active = button.dataset.role;
    showToast(`Switched to ${button.dataset.role} view`);
  });
});

/* Cards, CTA: ripple + feedback */
$$('.quick-card, .cta').forEach((element) => {
  element.addEventListener('click', (event) => {
    spawnRipple(event, element);
    if (element.dataset.toast) showToast(element.dataset.toast);
  });
});

/* Header actions */
const wishlistBtn = $('#wishlistBtn');
wishlistBtn.addEventListener('click', () => {
  const saved = wishlistBtn.classList.toggle('is-filled');
  wishlistBtn.setAttribute('aria-pressed', String(saved));
  showToast(saved ? 'Added to wishlist' : 'Removed from wishlist');
});

$('#bellBtn').addEventListener('click', () => showToast('You have no new notifications'));
$('#avatarBtn').addEventListener('click', () => showToast('Signed in as supplier@easytrade.io'));

/* Search */
const searchInput = $('#searchInput');
searchInput.addEventListener('keydown', (event) => {
  const query = searchInput.value.trim();
  if (event.key === 'Enter' && query) {
    showToast(`Searching for “${query}”…`);
    searchInput.blur();
  }
});

/* Placeholder links */
$$('a[href="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showToast(`Opening ${link.textContent.trim()}…`);
  });
});

/* Subtle parallax on the hero illustration */
const card = $('.success-card');
const heroArt = $('#heroArt');
card.addEventListener('mousemove', (event) => {
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  heroArt.style.transform = `scale(1.06) translate(${x * -10}px, ${y * -8}px)`;
});
card.addEventListener('mouseleave', () => {
  heroArt.style.transform = 'scale(1.04)';
});
