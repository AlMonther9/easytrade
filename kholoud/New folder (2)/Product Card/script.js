const favoriteBtn = document.getElementById("favoriteBtn");
const contactBtn = document.getElementById("contactBtn");

favoriteBtn.addEventListener("click", () => {
  const isActive = favoriteBtn.classList.toggle("active");
  favoriteBtn.setAttribute("aria-pressed", String(isActive));
});

contactBtn.addEventListener("click", () => {
  contactBtn.disabled = true;
  contactBtn.textContent = "Sending request...";
  setTimeout(() => {
    contactBtn.textContent = "Request Sent ✓";
    setTimeout(() => {
      contactBtn.textContent = "Contact Supplier";
      contactBtn.disabled = false;
    }, 2000);
  }, 900);
});
