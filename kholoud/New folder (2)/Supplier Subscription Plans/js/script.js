document.addEventListener("DOMContentLoaded", () => {
  const state = { plan: "starter" };

  const planNames = {
    starter: "Starter (Free)",
    professional: "Professional",
    enterprise: "Enterprise",
  };

  /* ---------- Toast ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("toast--visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("toast--visible"), 3200);
  }

  /* ---------- Modal ---------- */
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const modalConfirm = document.getElementById("modalConfirm");
  let pendingAction = null;

  function openModal({ title, text, confirmLabel, action }) {
    modalTitle.textContent = title;
    modalText.textContent = text;
    modalConfirm.textContent = confirmLabel;
    pendingAction = action;
    modal.hidden = false;
    modalConfirm.focus();
  }

  function closeModal() {
    modal.hidden = true;
    pendingAction = null;
  }

  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeModal)
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  modalConfirm.addEventListener("click", () => {
    if (pendingAction) pendingAction();
    closeModal();
  });

  /* ---------- Plan selection ---------- */
  const userPlanLabel = document.getElementById("userPlan");
  const planCards = document.querySelectorAll(".plan");

  function setCurrentPlan(planKey) {
    state.plan = planKey;
    userPlanLabel.textContent =
      planKey === "starter" ? "Free Plan" : planNames[planKey];
    planCards.forEach((card) => {
      card.classList.toggle("plan--current", card.dataset.plan === planKey);
    });
  }

  document.querySelector('[data-action="stay-free"]').addEventListener("click", () => {
    if (state.plan === "starter") {
      showToast("You're already on the Free plan.");
      return;
    }
    openModal({
      title: "Switch back to Free?",
      text: "You'll lose your paid features at the end of the current billing cycle and return to 5 product listings.",
      confirmLabel: "Switch to Free",
      action: () => {
        setCurrentPlan("starter");
        showToast("You've been switched back to the Free plan.");
      },
    });
  });

  document.querySelector('[data-action="upgrade"]').addEventListener("click", () => {
    if (state.plan === "professional") {
      showToast("You're already subscribed to Professional.");
      return;
    }
    openModal({
      title: "Upgrade to Professional?",
      text: "You'll be charged $49/month and immediately unlock unlimited listings, priority search ranking, and the advanced analytics dashboard.",
      confirmLabel: "Upgrade Now",
      action: () => {
        setCurrentPlan("professional");
        showToast("Welcome to Professional — your features are now active.");
      },
    });
  });

  document.querySelector('[data-action="contact-sales"]').addEventListener("click", () => {
    openModal({
      title: "Contact Sales",
      text: "Our enterprise team will reach out within one business day to build a custom contract for your distribution needs.",
      confirmLabel: "Request Contact",
      action: () => showToast("Request sent — sales will contact you shortly."),
    });
  });

  /* ---------- Misc links ---------- */
  document.getElementById("supportLink").addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Support chat opening soon — email help@easytrade.example for now.");
  });

  setCurrentPlan("starter");
});
