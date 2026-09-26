const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.getElementById("returnDashboard").addEventListener("click", () => {
  showToast("Returning to dashboard…");
});

document.getElementById("contactSupport").addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Support chat opening soon…");
});
