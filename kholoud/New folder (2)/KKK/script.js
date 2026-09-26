(function () {
  'use strict';

  var STORAGE_KEY = 'easytrade:notification-preferences';

  var switches = Array.prototype.slice.call(document.querySelectorAll('.switch'));
  var saveBtn = document.getElementById('saveBtn');
  var toastEl = document.getElementById('toast');

  var saved = load();
  var toastTimer;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch (e) {
      return null;
    }
  }

  function isOn(el) {
    return el.getAttribute('aria-checked') === 'true';
  }

  function setOn(el, on) {
    el.setAttribute('aria-checked', String(on));
    el.classList.toggle('is-on', on);
  }

  function currentState() {
    var state = {};
    switches.forEach(function (el) {
      state[el.dataset.pref] = isOn(el);
    });
    return state;
  }

  function isDirty() {
    var now = currentState();
    if (!saved) return true;
    return Object.keys(now).some(function (key) {
      return now[key] !== saved[key];
    });
  }

  function refreshSaveButton() {
    saveBtn.disabled = !isDirty();
    saveBtn.textContent = isDirty() ? 'Save Preferences' : 'Saved';
  }

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2600);
  }

  switches.forEach(function (el) {
    if (saved && typeof saved[el.dataset.pref] === 'boolean') {
      setOn(el, saved[el.dataset.pref]);
    }
    el.addEventListener('click', function () {
      setOn(el, !isOn(el));
      refreshSaveButton();
    });
  });

  saveBtn.addEventListener('click', function () {
    saved = currentState();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (e) {
      toast('Saved for this session only (storage unavailable).');
    }
    refreshSaveButton();
    toast('Your notification preferences have been saved.');
  });

  refreshSaveButton();
})();
