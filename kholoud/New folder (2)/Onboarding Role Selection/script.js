const roleCards = Array.from(document.querySelectorAll(".role-card"));
const continueBtn = document.getElementById("continue-btn");
const progressFill = document.getElementById("progress-fill");
const toast = document.getElementById("toast");

let toastTimer = null;

function selectCard(card) {
  roleCards.forEach((c) => {
    const isSelected = c === card;
    c.classList.toggle("selected", isSelected);
    c.setAttribute("aria-checked", String(isSelected));
  });
}

roleCards.forEach((card) => {
  card.addEventListener("click", () => selectCard(card));
});

continueBtn.addEventListener("click", () => {
  const selected = roleCards.find((c) => c.classList.contains("selected"));
  progressFill.style.width = "100%";
  showToast(`Setting up your ${selected.dataset.label} dashboard…`);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
}
