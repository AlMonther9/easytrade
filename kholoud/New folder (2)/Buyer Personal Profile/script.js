// Business Profile settings — interactions

const form = document.getElementById("profileForm");
const description = document.getElementById("description");
const charNow = document.getElementById("charNow");

// Live character counter for the description
function updateCount() {
  charNow.textContent = description.value.length;
}
description.addEventListener("input", updateCount);
updateCount();

// Logo upload
const logoInput = document.getElementById("logoInput");
const avatar = document.querySelector(".avatar");
const avatarIcon = document.querySelector(".avatar-icon");

document.getElementById("uploadLogo").addEventListener("click", () => logoInput.click());
document.querySelector(".avatar-edit").addEventListener("click", () => logoInput.click());

logoInput.addEventListener("change", () => {
  const file = logoInput.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  avatar.style.backgroundImage = `url(${url})`;
  avatar.style.backgroundSize = "cover";
  avatar.style.backgroundPosition = "center";
  if (avatarIcon) avatarIcon.style.display = "none";
});

document.getElementById("removeLogo").addEventListener("click", () => {
  avatar.style.backgroundImage = "";
  if (avatarIcon) avatarIcon.style.display = "";
  logoInput.value = "";
});

// Capture initial values so Discard can restore them
const fields = ["companyName", "businessType", "location", "yearEstablished", "description"];
const initial = {};
fields.forEach((id) => (initial[id] = document.getElementById(id).value));

document.getElementById("discardBtn").addEventListener("click", () => {
  fields.forEach((id) => (document.getElementById(id).value = initial[id]));
  updateCount();
});

// Save
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {};
  fields.forEach((id) => (data[id] = document.getElementById(id).value));
  fields.forEach((id) => (initial[id] = data[id]));

  const btn = form.querySelector(".btn-primary");
  const original = btn.textContent;
  btn.textContent = "Saved ✓";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 1600);

  console.log("Business profile saved:", data);
});
