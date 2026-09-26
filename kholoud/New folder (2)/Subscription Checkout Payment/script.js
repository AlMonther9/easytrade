// ============ Payment method toggle ============
const payOptions = document.querySelectorAll(".pay-option");
const radios = document.querySelectorAll('input[name="payMethod"]');
const cardForm = document.getElementById("cardForm");
const bankPanel = document.getElementById("bankPanel");
const payBtn = document.getElementById("payBtn");
const btnLabel = payBtn.querySelector(".btn-label");
const btnArrow = payBtn.querySelector(".btn-arrow");
const btnSpinner = payBtn.querySelector(".btn-spinner");
const statusMsg = document.getElementById("statusMsg");

function currentMethod() {
  return document.querySelector('input[name="payMethod"]:checked').value;
}

function syncMethodUI() {
  payOptions.forEach((opt) => {
    opt.classList.toggle("is-selected", opt.querySelector("input").checked);
  });
  const isCard = currentMethod() === "card";
  cardForm.hidden = !isCard;
  bankPanel.hidden = isCard;
  btnLabel.textContent = isCard ? "Complete Purchase" : "Confirm Bank Transfer";
  hideStatus();
}

radios.forEach((radio) => radio.addEventListener("change", syncMethodUI));

// ============ Input formatting ============
const cardholderInput = document.getElementById("cardholder");
const cardNumberInput = document.getElementById("cardNumber");
const expiryInput = document.getElementById("expiry");
const cvcInput = document.getElementById("cvc");

cardNumberInput.addEventListener("input", () => {
  const digits = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
  cardNumberInput.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
});

expiryInput.addEventListener("input", () => {
  let digits = expiryInput.value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 1) {
    let month = digits.slice(0, 2);
    if (month.length === 2 && parseInt(month, 10) > 12) month = "12";
    if (month.length === 2 && parseInt(month, 10) === 0) month = "01";
    digits = month + digits.slice(2);
  }
  expiryInput.value = digits.length > 2 ? digits.slice(0, 2) + " / " + digits.slice(2) : digits;
});

cvcInput.addEventListener("input", () => {
  cvcInput.value = cvcInput.value.replace(/\D/g, "").slice(0, 4);
});

// Clear the error state as soon as the user edits a field
[cardholderInput, cardNumberInput, expiryInput, cvcInput].forEach((input) => {
  input.addEventListener("input", () => clearError(input));
});

// ============ Validation ============
function setError(input, message) {
  const field = input.closest(".field");
  field.classList.add("has-error");
  field.querySelector(".error-msg").textContent = message;
}

function clearError(input) {
  const field = input.closest(".field");
  field.classList.remove("has-error");
  field.querySelector(".error-msg").textContent = "";
}

function luhnOk(digits) {
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

function validateCardForm() {
  let firstInvalid = null;

  const name = cardholderInput.value.trim();
  if (name.length < 3 || !/^[a-zA-Z\s.'-]+$/.test(name)) {
    setError(cardholderInput, "Enter the name as it appears on the card.");
    firstInvalid = firstInvalid || cardholderInput;
  }

  const digits = cardNumberInput.value.replace(/\D/g, "");
  if (digits.length !== 16 || !luhnOk(digits)) {
    setError(cardNumberInput, "Enter a valid 16-digit card number.");
    firstInvalid = firstInvalid || cardNumberInput;
  }

  const exp = expiryInput.value.replace(/\D/g, "");
  if (exp.length !== 4) {
    setError(expiryInput, "Enter the expiry date as MM / YY.");
    firstInvalid = firstInvalid || expiryInput;
  } else {
    const month = Number(exp.slice(0, 2));
    const year = 2000 + Number(exp.slice(2));
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    if (month < 1 || month > 12 || endOfMonth < new Date()) {
      setError(expiryInput, "This card has expired.");
      firstInvalid = firstInvalid || expiryInput;
    }
  }

  if (!/^\d{3,4}$/.test(cvcInput.value)) {
    setError(cvcInput, "Enter the 3-digit code on the back of your card.");
    firstInvalid = firstInvalid || cvcInput;
  }

  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

// ============ Purchase flow ============
function showStatus(text) {
  statusMsg.textContent = text;
  statusMsg.hidden = false;
  statusMsg.classList.add("is-success");
}

function hideStatus() {
  statusMsg.hidden = true;
  statusMsg.classList.remove("is-success");
}

function setLoading(loading) {
  payBtn.disabled = loading;
  btnArrow.hidden = loading;
  btnSpinner.hidden = !loading;
  btnLabel.textContent = loading
    ? "Processing…"
    : currentMethod() === "card"
      ? "Complete Purchase"
      : "Confirm Bank Transfer";
}

payBtn.addEventListener("click", () => {
  hideStatus();

  if (currentMethod() === "card") {
    if (!validateCardForm()) return;
    setLoading(true);
    // Simulated gateway call — replace with a real Stripe integration.
    setTimeout(() => {
      setLoading(false);
      showStatus("Payment successful! Your Professional Plan is now active.");
      payBtn.disabled = true;
      btnLabel.textContent = "Purchase Complete";
    }, 1600);
  } else {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showStatus("Order received! Transfer instructions were sent to your email. We'll activate your plan once the payment is verified.");
      payBtn.disabled = true;
      btnLabel.textContent = "Order Confirmed";
    }, 1200);
  }
});
