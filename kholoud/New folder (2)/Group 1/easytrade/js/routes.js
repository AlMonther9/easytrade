/* EasyTrade demo router — single source of truth for page links.
   Pages never hardcode each other's paths; they declare a route key here. */
(function () {
  'use strict';

  var HERE = new URL('.', document.currentScript.src);

  var PATHS = {
    landing: '../../../index.html',
    login: '../../../login.html',
    create: '../../../create.html',
    forget: '../../../forget.html',
    roleSelect: '../../../Browse Catalog.html',

    onboarding: '../../Onboarding Role Selection/index.html',
    marketplace: '../../Marketplace After Get Started/index.html',
    productDetails: '../../B2B Product Details Page/index.html',
    messages: '../../B2B Negotiation Inbox/index.html',
    saved: '../../e1e41083/index.html',
    savedEmpty: '../../Favorites Empty State/index.html',
    supplierProfile: '../../Supplier Profile/index.html',
    supplierProfileMobile: '../../Supplier Profile - mobile view/index.html',
    productCard: '../../Product Card/index.html',

    myProducts: '../../Supplier My Products Dashboard/index.html',
    myProductsAlt: '../../Frame 3/index.html',
    manageProducts: '../../easytrade-products/index.html',
    addProduct: '../../Create New Product Form/index.html',
    publishSuccess: '../../Product Publishing Success/index.html',
    buyerProfile: '../../Buyer Personal Profile/index.html',
    accountSecurity: '../../Frame 2/index.html',
    notifications: '../../KKK/index.html',
    supplierSettings: '../index.html',
    verification: '../../Verification Status Under Review/index.html',
    plans: '../../Supplier Subscription Plans/index.html',
    checkout: '../../Subscription Checkout Payment/index.html',
    boosts: '../../Body/index.html',
    boostConfig: '../../Body2/index.html',
    boostSelect: '../../bab3ddca/index.html'
  };

  /* Buttons/links whose label matches are wired to a route. */
  var BY_LABEL = {
    'log in': 'login',
    'get started': 'create',
    'create an account': 'create',
    'sell in bulk': 'login',
    'start sourcing': 'roleSelect',
    'browse catalog': 'roleSelect',
    'back to home': 'landing',
    'back to login': 'login',

    'marketplace': 'marketplace',
    'browse marketplace': 'marketplace',
    'messages': 'messages',
    'saved products': 'saved',
    'favorites': 'saved',
    'wishlist': 'saved',
    'account': 'buyerProfile',
    'your account': 'buyerProfile',
    'new message': 'marketplace',
    'premium grade avocados (hass)': 'productDetails',
    'apparel & textiles': 'marketplace',
    'easytrade home': 'marketplace',
    'easytrade': 'marketplace',
    'home': 'marketplace',

    'my products': 'myProducts',
    'dashboard': 'myProducts',
    'products': 'myProducts',
    'back to products': 'myProducts',
    'go to dashboard': 'myProducts',
    'return to dashboard': 'myProducts',
    'complete purchase': 'myProducts',

    'add new product': 'addProduct',
    'add another product': 'addProduct',
    'back to step 1': 'boostSelect',
    'select product to boost': 'boostSelect',
    'continue to boost details': 'boostConfig',

    'publish product': 'publishSuccess',
    'save as draft': 'myProducts',
    'view live product': 'productDetails',

    'send inquiry to supplier': 'messages',
    'send inquiry': 'messages',
    'contact supplier': 'messages',
    'contact apex textiles co.': 'messages',
    'view supplier profile': 'supplierProfile',

    'profile management': 'supplierSettings',
    'business profile': 'buyerProfile',
    'public profile': 'buyerProfile',
    'account security': 'accountSecurity',
    'notifications': 'notifications',
    'notification preferences': 'notifications',
    'marketing & boosts': 'boosts',
    'switch to buyer view': 'marketplace',
    'activate boost': 'boosts',
    'verification': 'verification',
    'subscription': 'plans'
  };

  /* Same label, different destination depending on where you are. */
  var PER_PAGE = {
    roleSelect: { 'continue to dashboard': 'onboarding' },
    onboarding: {
      'continue to dashboard': 'marketplace',
      'i want to buy': 'marketplace',
      'i want to sell': 'myProducts'
    },
    landing: { 'browse catalog': 'create' },
    marketplace: { 'contact supplier': 'plans' },
    supplierProfile: { 'contact supplier': 'plans', 'contact apex textiles co.': 'plans' },
    addProduct: { 'dashboard': 'myProducts', 'products': 'myProducts' },
    boosts: { 'subscription': 'plans' },
    buyerProfile: { 'update': 'plans' }
  };

  /* Never navigate: local-only controls and pages that don't exist yet. */
  var SKIP = /^(buyer|supplier|send|cancel|confirm|upgrade now|stay on free|contact sales|close|discard|save changes|upload|remove|filter|clear all filters|search|next|prev|all listings|published|drafts|out of stock|change|support center|contact (our support team|support|sales)|help center|terms of service|privacy policy|about us|our story|careers|contact|talk to sales|how it works|analytics guide|seller policy|contact us|mvp|verified suppliers|product categories|logistics support|trade assurance|dispute resolution|check availability|view all campaigns|start boost|boost profile|request sponsorship|newsletter|add custom field|×|x|→|›|\d+)$/i;

  /* data-et / data-page / data-nav on a nav item beats any label matching. */
  var NAV_KEYS = {
    'messages': 'messages', 'products': 'myProducts', 'my-products': 'myProducts',
    'profile': 'supplierSettings', 'marketing': 'boosts', 'boosts': 'boosts',
    'verification': 'verification', 'subscription': 'plans', 'plans': 'plans',
    'marketplace': 'marketplace', 'saved': 'saved', 'checkout': 'checkout',
    'add-product': 'addProduct', 'boost-select': 'boostSelect', 'boost-config': 'boostConfig',
    'publish-success': 'publishSuccess', 'supplier-profile': 'supplierProfile',
    'buyer-profile': 'buyerProfile', 'onboarding': 'onboarding', 'landing': 'landing',
    'public': 'buyerProfile', 'public-profile': 'buyerProfile',
    'security': 'accountSecurity', 'account-security': 'accountSecurity',
    'notification-preferences': 'notifications',
    'login': 'login', 'create': 'create'
  };

  var APP_PAGES = ['onboarding', 'marketplace', 'productDetails', 'messages', 'saved', 'savedEmpty',
    'supplierProfile', 'myProducts', 'addProduct', 'publishSuccess', 'buyerProfile', 'supplierSettings',
    'verification', 'plans', 'checkout', 'boosts', 'boostConfig', 'boostSelect'];

  function url(key) {
    return HERE.href + encodeURI(PATHS[key]);
  }

  function absolute(key) {
    return new URL(encodeURI(PATHS[key]), HERE).href;
  }

  function currentKey() {
    var here = decodeURI(location.href).replace(/\\/g, '/').toLowerCase().split('#')[0].split('?')[0];
    var best = null;
    for (var k in PATHS) {
      var candidate = decodeURI(absolute(k)).toLowerCase();
      if (here === candidate && (!best || PATHS[k].length > PATHS[best].length)) best = k;
    }
    return best;
  }

  var NOISE = /[\u2192\u2190\u2193\u00d7\u00b7\u00a0\u203a\u2039]/g;

  function labelOf(el) {
    var t = (el.getAttribute('aria-label') || el.textContent || '')
      .replace(NOISE, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return t.toLowerCase();
  }

  function targetFor(el, page) {
    var declared = el.getAttribute('data-et') || el.getAttribute('data-page') || el.getAttribute('data-nav');
    if (declared) {
      if (declared === 'none') return null;
      return NAV_KEYS[declared] || (PATHS[declared] ? declared : null);
    }

    var label = labelOf(el);
    if (!label) {
      /* Logo marks carry no text. */
      if (el.classList && (el.classList.contains('brand') || el.classList.contains('sidebar__logo'))) return 'marketplace';
      return null;
    }
    if (SKIP.test(label)) return null;
    var over = PER_PAGE[page] || {};
    if (over[label]) return over[label];
    for (var key in over) {
      if (label.indexOf(key) === 0) return over[key];
    }
    if (BY_LABEL[label]) return BY_LABEL[label];
    for (var k in BY_LABEL) {
      if (label.indexOf(k) === 0 && label.length <= k.length + 40) return BY_LABEL[k];
    }
    return null;
  }

  function isBroken(href) {
    return /^[a-z]:[\\/]/i.test(href) || /^file:\/\//i.test(href);
  }

  function wire(el, page) {
    var key = targetFor(el, page);
    if (!key) return;
    var href = url(key);

    if (el.tagName === 'A') {
      var existing = el.getAttribute('href') || '';
      var fillsGap = !existing || existing === '#' || isBroken(existing) || existing.charAt(0) === '/';
      if (!fillsGap) return;
      el.setAttribute('href', href);
      if (isBroken(existing)) el.removeAttribute('target');
      return;
    }

    if (el.tagName === 'BUTTON' && el.type === 'submit' && el.form) {
      var form = el.form;
      if (el.dataset.etWired) return;
      el.dataset.etWired = '1';
      /* Let the page validate first; only move on once the form is accepted. */
      el.addEventListener('click', function () { form.dataset.etTrigger = key; });
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (form.dataset.etTrigger !== key) return;
        if (form.querySelector('.invalid, [aria-invalid="true"]')) return;
        form.dataset.etTrigger = '';
        setTimeout(function () { location.href = href; }, 500);
      });
      return;
    }

    if (key === page || el.dataset.etWired) return;
    el.dataset.etWired = '1';
    el.addEventListener('click', function (ev) {
      ev.preventDefault();
      location.href = href;
    });
    el.title = 'EasyTrade demo → ' + key;
  }

  function wireCards(page) {
    if (page !== 'marketplace') return;
    document.addEventListener('click', function (ev) {
      if (ev.target.closest('a, button')) return;
      var supplier = ev.target.closest('.supplier-name');
      if (supplier) { location.href = url('supplierProfile'); return; }
      var card = ev.target.closest('.product-card');
      if (card) location.href = url('productDetails');
    });
  }

  function markActive(page) {
    if (!page) return;
    document.querySelectorAll('a[href], button').forEach(function (el) {
      if (targetFor(el, page) === page && (el.getAttribute('href') === '#' || !el.getAttribute('href'))) {
        el.setAttribute('aria-current', 'page');
      }
    });
  }

  function start() {
    var page = currentKey();
    document.querySelectorAll('a, button').forEach(function (el) { wire(el, page); });
    wireCards(page);
    markActive(page);
    document.documentElement.dataset.etPage = page || 'unknown';
  }

  window.EasyTrade = {
    url: url,
    paths: PATHS,
    page: currentKey(),
    probe: function (el) {
      var label = labelOf(el);
      return { label: label, skipped: SKIP.test(label), target: targetFor(el, currentKey()) };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
