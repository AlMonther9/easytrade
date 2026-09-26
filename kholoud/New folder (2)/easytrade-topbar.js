/* EasyTrade unified navbar — the Marketplace top bar, reused on every page.
   Pages only carry <header id="etTopbar"></header>; this builds the bar, points
   every control at a real page and marks the current section active.
   Styles live in easytrade-topbar.css. Loaded without `defer` so page scripts
   that look up #headerSearch / #roleSwitch / #wishlistCount find them. */
(function () {
  'use strict';

  var BASE = new URL('.', document.currentScript.src);

  /* Folder of each page, relative to this script. Mirrors easytrade-sidebar.js. */
  var DIRS = {
    marketplace: 'Marketplace After Get Started',
    messages: 'B2B Negotiation Inbox',
    saved: 'e1e41083',
    savedEmpty: 'Favorites Empty State',
    notifications: 'KKK',
    buyerProfile: 'Buyer Personal Profile',
    accountSecurity: 'Frame 2',
    supplierProfile: 'Supplier Profile',
    plans: 'Supplier Subscription Plans'
  };

  var LOGO = new URL(encodeURI(DIRS.marketplace) + '/assets/img/logo.png', BASE).href;
  var LANDING = new URL('../index.html', BASE).href;

  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'
  };

  /* Pages that own the navbar: Supplier-side vs Buyer-side highlights. */
  var SUPPLIER_PAGES = ['Supplier Profile', 'Supplier Subscription Plans',
    'Supplier My Products Dashboard', 'Create New Product Form', 'easytrade-products',
    'Product Publishing Success', 'Subscription Checkout Payment', 'Group 1/easytrade',
    'Verification Status Under Review', 'Body', 'Body2', 'bab3ddca'];

  function urlFor(key) {
    return new URL(encodeURI(DIRS[key]) + '/index.html', BASE).href;
  }

  function normalized(url) {
    return decodeURI(url).replace(/\\/g, '/').toLowerCase().split('#')[0].split('?')[0];
  }

  function currentKey() {
    var here = normalized(location.href);
    for (var key in DIRS) {
      if (normalized(urlFor(key)) === here) return key;
    }
    return null;
  }

  function isSupplierPage() {
    var here = normalized(location.href);
    return SUPPLIER_PAGES.some(function (dir) {
      return here === normalized(new URL(encodeURI(dir) + '/index.html', BASE).href);
    });
  }

  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  function navLink(key, label, activeKey) {
    return '<a href="' + urlFor(key) + '"' + (key === activeKey ? ' class="is-active" aria-current="page"' : '') +
      '>' + label + '</a>';
  }

  function build(activeKey) {
    /* Pages that put the search in the supplier rail don't get a second box. */
    var search = document.querySelector('[data-et-sidebar-search]') ? '' :
      '<div class="et-topbar__search">' + svg('search') +
      '<input id="headerSearch" type="search" placeholder="Search products..." aria-label="Search products"></div>';

    return '<div class="et-topbar__inner">' +
      '<a class="et-topbar__brand" href="' + urlFor('marketplace') + '" aria-label="EasyTrade home">' +
      '<img class="et-topbar__logo" src="' + LOGO + '" alt="EasyTrade"></a>' +

      search +

      '<nav class="et-topbar__nav" aria-label="Primary">' +
      navLink('marketplace', 'Marketplace', activeKey) +
      navLink('messages', 'Messages', activeKey) +
      '</nav>' +

      '<div class="et-topbar__roles" id="roleSwitch" role="group" aria-label="Account type">' +
      '<button type="button" data-role="buyer">Buyer</button>' +
      '<button type="button" data-role="supplier">Supplier</button>' +
      '</div>' +

      '<div class="et-topbar__actions">' +
      '<a class="et-topbar__icon" id="wishlistBtn" href="' + urlFor('savedEmpty') + '" data-et="savedEmpty" aria-label="Wishlist">' +
      svg('heart') + '<span class="et-topbar__badge" id="wishlistCount" hidden>0</span></a>' +
      '<a class="et-topbar__icon" id="notifBtn" href="' + urlFor('notifications') + '" aria-label="Notifications">' +
      svg('bell') + '</a>' +
      '<a class="et-topbar__avatar" id="accountBtn" href="' + urlFor('buyerProfile') + '" aria-label="Account"></a>' +
      '</div>' +
      '</div>';
  }

  function highlightRole(root) {
    var supplier = isSupplierPage();
    root.querySelectorAll('#roleSwitch button').forEach(function (btn) {
      var on = (btn.dataset.role === 'supplier') === supplier;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  function wire(root, activeKey) {
    /* Buyer / Supplier jumps to that side's home page. */
    root.querySelector('#roleSwitch').addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-role]');
      if (!btn) return;
      location.href = urlFor(btn.dataset.role === 'supplier' ? 'supplierProfile' : 'buyerProfile');
    });

    /* Search always runs against the Marketplace, wherever you type it from. */
    var input = root.querySelector('#headerSearch');
    if (activeKey === 'marketplace' || !input) return; /* that page filters live */
    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      var q = input.value.trim();
      location.href = urlFor('marketplace') + (q ? '?q=' + encodeURIComponent(q) : '');
    });
  }

  function start() {
    var target = document.getElementById('etTopbar');
    if (!target) {
      target = document.createElement('header');
      target.id = 'etTopbar';
      document.body.insertBefore(target, document.body.firstChild);
    }
    var activeKey = currentKey();
    target.classList.add('et-topbar');
    /* The shared sidebar is fixed, so full-width blocks need its reserved space. */
    if (document.querySelector('.et-sidebar')) target.classList.add('et-page');
    target.innerHTML = build(activeKey);
    highlightRole(target);
    wire(target, activeKey);
  }

  /* The placeholder is already parsed when the script tag follows it, so build
     straight away — page scripts such as the Marketplace's look up #headerSearch
     the moment they run. */
  if (document.getElementById('etTopbar') || document.readyState !== 'loading') {
    start();
  } else {
    document.addEventListener('DOMContentLoaded', start);
  }
})();
