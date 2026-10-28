/* Madhushala Pro - Assam Excise | UI enhancements (no dependencies) */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Footer year */
  var yr = $('#assam-footer-year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Scroll-linked UI: progress bar, nav state, back-to-top, scroll-spy */
  var bar = $('.ax-progress'), nav = $('.ax-nav'), topBtn = $('.ax-top');
  var spy = $$('.ax-links a[href^="#"]:not(.ax-nav-cta)')
    .map(function (a) { return { a: a, el: $(a.getAttribute('href')) }; })
    .filter(function (x) { return x.el; });
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    if (nav) nav.classList.toggle('is-scrolled', y > 30);
    if (topBtn) topBtn.classList.toggle('is-show', y > 600);
    var mark = y + window.innerHeight * 0.35, current = null;
    spy.forEach(function (s) { if (s.el.offsetTop <= mark) current = s; });
    spy.forEach(function (s) { s.a.classList.toggle('is-active', s === current); });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (topBtn) topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* Mobile menu */
  var burger = $('.ax-burger'), menu = $('.ax-links');
  if (burger && menu) {
    var close = function () {
      burger.classList.remove('is-open');
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    };
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('is-open');
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open);
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* Scroll reveal with automatic stagger inside grids */
  var targets = [];
  function add(el, cls, delay) {
    if (!el || el.classList.contains('ax-reveal')) return;
    el.classList.add('ax-reveal');
    if (cls) el.classList.add(cls);
    if (delay) el.style.setProperty('--ax-delay', delay + 's');
    targets.push(el);
  }

  [
    ['.assam-challenges-grid', '.assam-challenge-card'],
    ['.assam-features-grid', '.assam-feature-card'],
    ['.assam-why-grid', '.assam-why-card'],
    ['.assam-workflow-track', '.assam-workflow-step'],
    ['.assam-video-highlights', 'div'],
    ['.assam-register-benefits', 'div'],
    ['.assam-mgr-metrics', '.assam-mgr-metric'],
    ['.assam-billing-features', '.assam-billing-feature'],
    ['.assam-reports-copy', '.assam-reports-feature'],
    ['.assam-contact-points', 'div']
  ].forEach(function (g) {
    $$(g[0]).forEach(function (wrap) {
      Array.prototype.filter.call(wrap.children, function (c) { return c.matches(g[1]); })
        .forEach(function (el, i) { add(el, 'ax-zoom', i * 0.1); });
    });
  });

  /* trust strip items are above the fold on many screens: gentle stagger */
  $$('.assam-trust-item').forEach(function (el, i) { add(el, 'ax-zoom', i * 0.1); });

  [
    ['.assam-video-heading,.assam-challenges-heading,.assam-integration-heading,.assam-features-heading,' +
     '.assam-register-heading,.assam-mgr-heading,.assam-workflow-heading,.assam-reports-heading,.assam-why-heading', null],
    ['.assam-video-frame', 'ax-zoom'],
    ['.assam-integration-note', null],
    ['.assam-features-cta', null],
    ['.assam-register-card', 'ax-zoom'],
    ['.assam-mgr-dashboard', 'ax-zoom'],
    ['.assam-workflow-bottom', null],
    ['.assam-why-bottom', null],
    ['.assam-contact-card', 'ax-zoom']
  ].forEach(function (p) { $$(p[0]).forEach(function (el) { add(el, p[1]); }); });

  /* two-column layouts slide in from opposite sides */
  $$('.assam-billing-content').forEach(function (el) { add(el, 'ax-left'); });
  $$('.assam-billing-visual').forEach(function (el) { add(el, 'ax-right', 0.15); });
  $$('.assam-reports-preview').forEach(function (el) { add(el, 'ax-right', 0.15); });
  $$('.assam-system-card').forEach(function (el, i) { add(el, i ? 'ax-right' : 'ax-left'); });
  $$('.assam-integration-connector').forEach(function (el) { add(el, 'ax-zoom', 0.15); });

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Cursor spotlight on cards + subtle parallax on hero orbs */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    $$('.assam-challenge-card,.assam-feature-card,.assam-why-card,.assam-workflow-step,.assam-system-card')
      .forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
      });

    var orbs = $$('.ax-orb');
    window.addEventListener('pointermove', function (e) {
      var x = e.clientX / window.innerWidth - 0.5;
      var y = e.clientY / window.innerHeight - 0.5;
      orbs.forEach(function (o, i) {
        o.style.translate = (x * (i ? -40 : 40)) + 'px ' + (y * (i ? -30 : 30)) + 'px';
      });
    }, { passive: true });
  }
})();
