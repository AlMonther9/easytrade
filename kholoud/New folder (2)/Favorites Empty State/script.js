const browseBtn = document.getElementById("browse-btn");
const toast = document.getElementById("toast");
const yearEl = document.getElementById("year");

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

browseBtn.addEventListener("click", () => {
  showToast("Opening marketplace…");
});

document.querySelectorAll(".footer-links a, .footer-social a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(`${link.textContent.trim() || link.getAttribute("aria-label")} — coming soon`);
  });
});

yearEl.textContent = new Date().getFullYear();
