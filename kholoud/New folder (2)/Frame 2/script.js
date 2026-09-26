const form = document.getElementById('securityForm');
const tfaSwitch = document.getElementById('tfaSwitch');
const emailBox = document.getElementById('emailBox');
const toast = document.getElementById('toast');

const currentPassword = document.getElementById('currentPassword');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');
const strengthBar = document.getElementById('strengthBar');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function setError(input, message) {
  const errorEl = document.getElementById(input.id + 'Error');
  errorEl.textContent = message;
  errorEl.classList.toggle('show', Boolean(message));
  input.classList.toggle('invalid', Boolean(message));
}

document.querySelectorAll('.reveal').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    btn.textContent = showing ? 'Show' : 'Hide';
  });
});

newPassword.addEventListener('input', () => {
  const value = newPassword.value;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  strengthBar.style.width = value ? `${(score / 4) * 100}%` : '0';
  strengthBar.style.background =
    score <= 1 ? '#E5484D' : score === 2 ? '#F5A623' : score === 3 ? '#38B6F0' : '#22A06B';
});

tfaSwitch.addEventListener('click', () => {
  const on = tfaSwitch.classList.toggle('on');
  tfaSwitch.setAttribute('aria-checked', String(on));
  emailBox.classList.toggle('hidden', !on);
});

document.getElementById('manageSessions').addEventListener('click', (e) => {
  e.preventDefault();
  showToast('Session management is not part of this design');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  if (!currentPassword.value) {
    setError(currentPassword, 'Please enter your current password.');
    valid = false;
  } else if (currentPassword.value.length < 8) {
    setError(currentPassword, 'Current password must be at least 8 characters.');
    valid = false;
  } else {
    setError(currentPassword, '');
  }

  if (!newPassword.value) {
    setError(newPassword, 'Please choose a new password.');
    valid = false;
  } else if (newPassword.value.length < 8) {
    setError(newPassword, 'New password must be at least 8 characters.');
    valid = false;
  } else if (newPassword.value === currentPassword.value) {
    setError(newPassword, 'New password must differ from the current one.');
    valid = false;
  } else {
    setError(newPassword, '');
  }

  if (confirmPassword.value !== newPassword.value) {
    setError(confirmPassword, 'Passwords do not match.');
    valid = false;
  } else {
    setError(confirmPassword, '');
  }

  if (!valid) {
    showToast('Please fix the highlighted fields');
    return;
  }

  showToast('Security settings updated successfully');
  form.reset();
  strengthBar.style.width = '0';
});
