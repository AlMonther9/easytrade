/* EasyTrade — Supplier Profile & Verification
   This script renders the page (form, docs, toast)
   and wires all behaviour: roles, doc uploads, save flow. */
(() => {
  'use strict';

  const DOC_TYPES = /\.(pdf|jpe?g|png)$/i;

  /* ================= markup ================= */

  const ICONS = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m15 15-3-3-3 3"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'
  };

  const dropZone = (id, label) => `
    <label class="drop" data-doc="${id}">
      <input type="file" id="${id}" accept=".pdf,.jpg,.jpeg,.png" hidden>
      ${ICONS.upload}
      <b>${label}</b>
      <small>Click to browse or drag and drop</small>
      <span class="drop__picked"><i aria-hidden="true">&#10003;</i><em class="drop__name"></em><button type="button" class="drop__x" aria-label="Remove file">&times;</button></span>
    </label>`;

  const view = `

  <div class="shell">
    <aside class="et-sidebar" data-et-rail></aside>

    <main class="content">
      <h1>Supplier: Profile &amp; Verification</h1>
      <p class="content__lede">Manage your business identity, documents, and verification status.</p>

      <section class="panel" aria-labelledby="panelTitle">
        <h2 id="panelTitle">Company Information</h2>
        <form id="profileForm" novalidate>
          <div class="row">
            <label for="companyName">Company Name</label>
            <input id="companyName" type="text" value="Global Logistics Ltd.">
          </div>
          <div class="row">
            <label for="businessBio">Business Bio</label>
            <textarea id="businessBio" rows="4">Leading international supplier specializing in sustainable textile manufacturing and bulk distribution for over 15 years.</textarea>
          </div>
          <div class="row">
            <label for="location">Physical Location</label>
            <div class="row__withpin">
              ${ICONS.pin}
              <input id="location" type="text" value="Industrial Zone 4, Building 12, Cairo, Egypt">
            </div>
          </div>

          <fieldset class="docs">
            <legend>${ICONS.shield} Identity Verification</legend>
            <p>Documents must be valid and in PDF, JPG, or PNG format.</p>
            <div class="docs__grid">
              ${dropZone('fileRegistry', 'Commercial Registry')}
              ${dropZone('fileTax', 'Tax Card')}
            </div>
          </fieldset>

          <div class="panel__foot">
            <button type="submit" id="saveBtn">
              ${ICONS.save}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </section>

      <div class="pager" aria-hidden="true"><span></span><span></span><span></span></div>
    </main>
  </div>

  <div class="toast" id="toast" role="status" aria-live="polite">
    ${ICONS.check}
    <span>Profile saved successfully</span>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', view);

  /* ================= behaviour ================= */

  const toast = document.getElementById('toast');
  const toastText = toast.querySelector('span');
  let toastTimer;

  function notify(message, isError = false) {
    toastText.textContent = message;
    toast.style.background = isError ? '#b91c1c' : '#102a43';
    toast.toggleAttribute('data-show', true);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.removeAttribute('data-show'), 2800);
  }

  /* document drop zones */
  document.querySelectorAll('.drop').forEach((zone) => {
    const input = zone.querySelector('input[type="file"]');
    const nameEl = zone.querySelector('.drop__name');
    const clearBtn = zone.querySelector('.drop__x');

    const accept = (file) => {
      if (!DOC_TYPES.test(file.name)) {
        notify('Only PDF, JPG, or PNG files are allowed', true);
        return;
      }
      nameEl.textContent = file.name;
      zone.setAttribute('data-file', '');
    };

    const reset = () => {
      input.value = '';
      nameEl.textContent = '';
      zone.removeAttribute('data-file');
    };

    input.addEventListener('change', () => input.files[0] && accept(input.files[0]));

    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      reset();
    });

    ['dragenter', 'dragover'].forEach((type) =>
      zone.addEventListener(type, (e) => {
        e.preventDefault();
        zone.setAttribute('data-over', '');
      }));

    ['dragleave', 'drop'].forEach((type) =>
      zone.addEventListener(type, (e) => {
        e.preventDefault();
        zone.removeAttribute('data-over');
      }));

    zone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (!file) return;
      input.files = e.dataTransfer.files;
      accept(file);
    });
  });

  /* save flow */
  const form = document.getElementById('profileForm');
  const saveBtn = document.getElementById('saveBtn');
  const saveLabel = saveBtn.querySelector('span');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (saveBtn.dataset.state === 'saving') return;

    saveBtn.dataset.state = 'saving';
    saveLabel.textContent = 'Saving...';

    setTimeout(() => {
      saveBtn.dataset.state = 'saved';
      saveLabel.textContent = 'Saved';
      notify('Profile saved successfully');

      setTimeout(() => {
        delete saveBtn.dataset.state;
        saveLabel.textContent = 'Save Changes';
      }, 2200);
    }, 900);
  });
})();
