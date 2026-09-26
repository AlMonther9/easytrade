/* =========================================================
   EasyTrade — unified supplier rail.
   Pages that opt in carry <aside class="et-sidebar" data-et-rail></aside>
   followed by this script tag (without `defer`, so the page's own script
   still finds the search input declared with data-et-search).
   Hand-written rails (the buyer settings screens) keep the old behaviour:
   click-to-activate plus a rail search that runs the Marketplace.
   ========================================================= */
(function () {
  'use strict';

  var BASE = new URL('.', document.currentScript.src);
  var ASSETS = BASE + encodeURI('Verification Status Under Review') + '/assets/';

  /* Folder each rail item points at. */
  var DIR = {
    marketplace: 'Marketplace After Get Started',
    messages: 'B2B Negotiation Inbox',
    products: 'Supplier My Products Dashboard',
    profile: 'Group 1/easytrade',
    boosts: 'Body',
    verification: 'Verification Status Under Review',
    plans: 'Supplier Subscription Plans'
  };

  var MARKETPLACE = BASE + encodeURI(DIR.marketplace) + '/index.html';

  var NAV = [
    ['messages', 'icon-messages.png', 'Messages'],
    ['products', 'icon-products.png', 'My Products'],
    ['profile', 'icon-profile.png', 'Profile Management'],
    ['boosts', 'icon-marketing.png', 'Marketing &amp; Boosts'],
    ['verification', 'icon-verification.png', 'Verification'],
    ['plans', 'icon-subscription.png', 'Subscription']
  ];

  /* Detail screens that sit outside the rail but belong to one of its items. */
  var PIN = {
    'Frame 3': 'products',
    'easytrade-products': 'products',
    'Create New Product Form': 'products',
    'Product Publishing Success': 'products',
    'Body2': 'boosts',
    'bab3ddca': 'boosts',
    'Subscription Checkout Payment': 'plans'
  };

  function url(key) {
    return BASE + encodeURI(DIR[key]) + '/index.html';
  }

  function normalized(href) {
    return decodeURI(href).replace(/\\/g, '/').toLowerCase().split('#')[0].split('?')[0];
  }

  function activeKey() {
    var here = normalized(location.href);
    for (var key in DIR) {
      if (normalized(url(key)) === here) return key;
    }
    for (var folder in PIN) {
      if (here.indexOf(normalized(BASE + encodeURI(folder) + '/')) === 0) return PIN[folder];
    }
    return null;
  }

  function navItem(key, icon, label, isActive) {
    return '<a href="' + url(key) + '" class="et-nav-item' + (isActive ? ' active' : '') + '"' +
      (isActive ? ' aria-current="page"' : '') + '>' +
      '<img src="' + ASSETS + icon + '" alt="" class="et-nav-icon" />' +
      '<span>' + label + '</span></a>';
  }

  function railHtml(active, searchId) {
    var search = searchId ?
      '<div class="et-sidebar__search">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
      '<input id="' + searchId + '" type="search" placeholder="Search products..." aria-label="Search products"></div>' : '';

    return '<a class="et-brand" href="' + MARKETPLACE + '">' +
      '<img src="' + ASSETS + 'logo.png" alt="EasyTrade" class="et-brand-logo" /></a>' +
      search +
      '<nav class="et-nav" aria-label="Primary">' +
      NAV.map(function (row) { return navItem(row[0], row[1], row[2], row[0] === active); }).join('') +
      '</nav>' +
      '<div class="et-sidebar-footer">' +
      '<a href="' + MARKETPLACE + '" class="et-nav-item">' +
      '<img src="' + ASSETS + 'icon-switch.png" alt="" class="et-nav-icon" />' +
      '<span>Switch to Buyer View</span></a>' +
      '<div class="et-user-card">' +
      '<div class="et-avatar"><img src="' + ASSETS + 'avatar-bg.png" alt="John Supplier avatar" /></div>' +
      '<div class="et-user-meta">' +
      '<span class="et-user-name">John Supplier</span>' +
      '<span class="et-user-plan">Free Plan</span>' +
      '</div></div></div>';
  }

  document.querySelectorAll('[data-et-rail]').forEach(function (rail) {
    rail.innerHTML = railHtml(activeKey(), rail.getAttribute('data-et-search'));
  });

  document.querySelectorAll('.et-sidebar:not([data-et-rail])').forEach(function (sidebar) {
    var items = Array.prototype.slice.call(sidebar.querySelectorAll('.et-nav-item'));
    var here = normalized(location.href);

    items.forEach(function (el) {
      if (normalized(el.href) === here) el.classList.add('active');
      el.addEventListener('click', function () {
        items.forEach(function (other) { other.classList.toggle('active', other === el); });
      });
    });

    var search = sidebar.querySelector('form.et-sidebar__search');
    if (!search) return;
    search.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = search.querySelector('input').value.trim();
      location.href = MARKETPLACE + (q ? '?q=' + encodeURIComponent(q) : '');
    });
  });
})();
