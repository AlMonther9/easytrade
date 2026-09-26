(function () {
  'use strict';

  /* ---------- Gallery ---------- */
  var media = document.getElementById('media');
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.thumb'));

  function selectThumb(thumb) {
    thumbs.forEach(function (t) {
      var active = t === thumb;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
    media.dataset.variant = thumb.dataset.variant;
  }

  thumbs.forEach(function (thumb, i) {
    thumb.addEventListener('click', function () { selectThumb(thumb); });
    thumb.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var step = e.key === 'ArrowRight' ? 1 : thumbs.length - 1;
      var next = thumbs[(i + step) % thumbs.length];
      next.focus();
      selectThumb(next);
    });
  });

  /* ---------- Inquiry modal ---------- */
  var modal = document.getElementById('inquiryModal');
  var openBtn = document.getElementById('inquiryBtn');
  var formView = modal.querySelector('.modal__formview');
  var successView = modal.querySelector('.modal__success');
  var form = document.getElementById('inquiryForm');
  var lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    var first = form.elements['name'];
    if (first) window.setTimeout(function () { first.focus(); }, 0);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (!successView.hidden) {
      successView.hidden = true;
      formView.hidden = false;
      form.reset();
    }
    if (lastFocus) lastFocus.focus();
  }

  openBtn.addEventListener('click', openModal);
  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* ---------- Form validation ---------- */
  var validators = {
    name: function (v) {
      return v.trim().length >= 2 || 'Please enter your full name.';
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.';
    },
    quantity: function (v) {
      var n = Number(v);
      return (Number.isFinite(n) && n >= 100) || 'Minimum order is 100 pieces.';
    }
  };

  function validateField(input) {
    var rule = validators[input.name];
    if (!rule) return true;
    var result = rule(input.value);
    var field = input.closest('.field');
    if (result === true) {
      field.classList.remove('invalid');
      return true;
    }
    field.querySelector('.error').textContent = result;
    field.classList.add('invalid');
    return false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var inputs = ['name', 'email', 'quantity'].map(function (n) { return form.elements[n]; });
    var allValid = inputs.map(validateField).every(Boolean);
    if (!allValid) {
      var firstInvalid = inputs.filter(function (i) {
        return i.closest('.field').classList.contains('invalid');
      })[0];
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    formView.hidden = true;
    successView.hidden = false;
  });

  form.addEventListener('input', function (e) {
    var field = e.target.closest('.field');
    if (field && field.classList.contains('invalid')) validateField(e.target);
  });

  /* ---------- Placeholder links ---------- */
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();
