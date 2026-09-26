const DRAFT_KEY = 'b2b-product-draft';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];

const form = document.getElementById('product-form');
const nameInput = document.getElementById('product-name');
const categorySelect = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const moqInput = document.getElementById('moq');
const specRows = document.getElementById('spec-rows');
const addFieldBtn = document.getElementById('add-field');
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const thumbs = document.getElementById('thumbs');
const saveDraftBtn = document.getElementById('save-draft');
const toastEl = document.getElementById('toast');

const X_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

const PRODUCT_IMAGE = { src: 'images/cotton-bedspread.png', name: 'Premium Cotton Bedspread' };

const PLACEHOLDER_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="4"/><path d="M13 20h5a2 2 0 0 0 2-2v-5"/></svg>';

let toastTimer;

function toast(message, type = 'success') {
  toastEl.textContent = message;
  toastEl.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
}

/* ---------- Specification rows ---------- */

function createSpecRow({ prop = '', val = '', preset = false } = {}) {
  const row = document.createElement('div');
  row.className = 'spec-row';
  if (preset) row.dataset.preset = '';

  const propInput = document.createElement('input');
  propInput.type = 'text';
  propInput.className = 'input-prop' + (preset ? ' preset' : '');
  propInput.placeholder = 'Property';
  propInput.value = prop;
  propInput.readOnly = preset;

  const valInput = document.createElement('input');
  valInput.type = 'text';
  valInput.className = 'input-val';
  valInput.placeholder = 'e.g. Value';
  valInput.value = val;

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'row-remove';
  remove.setAttribute('aria-label', 'Remove field');
  remove.innerHTML = X_SVG;
  remove.addEventListener('click', () => row.remove());

  row.append(propInput, valInput, remove);
  return row;
}

addFieldBtn.addEventListener('click', () => {
  const row = createSpecRow();
  specRows.appendChild(row);
  row.querySelector('.input-prop').focus();
});

function collectSpecs() {
  return [...specRows.querySelectorAll('.spec-row')].map(row => ({
    prop: row.querySelector('.input-prop').value,
    val: row.querySelector('.input-val').value,
    preset: row.hasAttribute('data-preset')
  }));
}

/* ---------- Media ---------- */

function makeRemoveButton(onRemove) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'thumb-remove';
  btn.setAttribute('aria-label', 'Remove image');
  btn.innerHTML = X_SVG;
  btn.addEventListener('click', onRemove);
  return btn;
}

function renderInitialThumbs() {
  thumbs.innerHTML = '';
  addThumb(PRODUCT_IMAGE.src, PRODUCT_IMAGE.name);
  const figure = document.createElement('figure');
  figure.className = 'thumb';
  figure.innerHTML = PLACEHOLDER_ICON;
  figure.appendChild(makeRemoveButton(() => figure.remove()));
  thumbs.appendChild(figure);
}

function addThumb(src, name) {
  const figure = document.createElement('figure');
  figure.className = 'thumb';
  const img = document.createElement('img');
  img.src = src;
  img.alt = name;
  figure.appendChild(img);
  figure.appendChild(makeRemoveButton(() => {
    URL.revokeObjectURL(src);
    figure.remove();
  }));
  thumbs.appendChild(figure);
}

function handleFiles(fileList) {
  [...fileList].forEach(file => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast(`"${file.name}" is not supported. Use SVG, PNG or JPG.`, 'error');
    } else if (file.size > MAX_FILE_SIZE) {
      toast(`"${file.name}" exceeds the 5MB limit.`, 'error');
    } else {
      addThumb(URL.createObjectURL(file), file.name);
    }
  });
}

uploadZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  handleFiles(fileInput.files);
  fileInput.value = '';
});

['dragenter', 'dragover'].forEach(evt =>
  uploadZone.addEventListener(evt, e => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  })
);

['dragleave', 'drop'].forEach(evt =>
  uploadZone.addEventListener(evt, e => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
  })
);

uploadZone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));

/* ---------- Validation & publish ---------- */

const validators = [
  { el: nameInput, test: v => v.trim() !== '', msg: 'Product name is required.' },
  { el: categorySelect, test: v => v !== '', msg: 'Please select a category.' },
  { el: priceInput, test: v => v !== '' && Number(v) > 0, msg: 'Enter a price greater than 0.' },
  { el: moqInput, test: v => v !== '' && Number.isFinite(Number(v)) && Number(v) >= 1, msg: 'MOQ must be at least 1.' }
];

function setFieldError(el, message) {
  const field = el.closest('.field');
  field.classList.add('invalid');
  field.querySelector('.error-msg').textContent = message;
}

function clearFieldError(el) {
  const field = el.closest('.field');
  field.classList.remove('invalid');
  field.querySelector('.error-msg').textContent = '';
}

validators.forEach(({ el }) => {
  el.addEventListener('input', () => clearFieldError(el));
  el.addEventListener('change', () => clearFieldError(el));
});

form.addEventListener('submit', e => {
  e.preventDefault();
  let firstInvalid = null;
  validators.forEach(({ el, test, msg }) => {
    if (test(el.value)) {
      clearFieldError(el);
    } else {
      setFieldError(el, msg);
      firstInvalid = firstInvalid || el;
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    toast('Please fix the highlighted fields.', 'error');
    return;
  }

  localStorage.removeItem(DRAFT_KEY);
  toast('Product published successfully.');
  resetForm();
});

function resetForm() {
  form.reset();
  validators.forEach(({ el }) => clearFieldError(el));
  specRows.querySelectorAll('.spec-row:not([data-preset])').forEach(row => row.remove());
  specRows.querySelectorAll('.spec-row[data-preset] .input-val').forEach(input => { input.value = ''; });
  renderInitialThumbs();
}

/* ---------- Draft persistence ---------- */

saveDraftBtn.addEventListener('click', () => {
  const draft = {
    name: nameInput.value,
    category: categorySelect.value,
    description: descriptionInput.value,
    price: priceInput.value,
    moq: moqInput.value,
    specs: collectSpecs().filter(s => s.preset ? s.val !== '' : (s.prop !== '' || s.val !== ''))
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  toast('Draft saved.');
});

function restoreDraft() {
  let draft;
  try {
    draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
  } catch {
    return;
  }
  if (!draft) return;

  nameInput.value = draft.name || '';
  if (draft.category) categorySelect.value = draft.category;
  descriptionInput.value = draft.description || '';
  priceInput.value = draft.price || '';
  moqInput.value = draft.moq || '';

  const presetRows = [...specRows.querySelectorAll('.spec-row[data-preset]')];
  (draft.specs || []).forEach((spec, i) => {
    if (i < presetRows.length) {
      presetRows[i].querySelector('.input-val').value = spec.val || '';
    } else if (!spec.preset) {
      specRows.appendChild(createSpecRow({ prop: spec.prop, val: spec.val }));
    }
  });
}

renderInitialThumbs();
restoreDraft();
