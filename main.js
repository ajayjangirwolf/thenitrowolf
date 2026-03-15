/* ═══════════════════════════════════════════
   NITRO WOLF — main.js
   Pure vanilla JS, no frameworks
═══════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────
   DOM READY
────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNav();
  initHamburger();
  initReveal();
  initFaq();
  initWorkFilters();
  initFormSubmit();
  handleInitialRoute();
});

/* ──────────────────────────────
   PAGE LOADER
────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1400);
  });
}

/* ──────────────────────────────
   NAV SCROLL SHADOW
────────────────────────────── */
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
  document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-links a[data-page]').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}
function initHamburger() {
  const btn  = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.contains('open');

    if (isOpen) {
      closeMenu(btn, menu);
    } else {
      openMenu(btn, menu);
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      closeMenu(btn, menu);
    }
  });

  // Mobile link click → close menu
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu(btn, menu));
  });
}

function openMenu(btn, menu) {
  btn.classList.add('open');
  menu.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');
}

function closeMenu(btn, menu) {
  btn.classList.remove('open');
  menu.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}

/* ──────────────────────────────
   PAGE NAVIGATION w/ TRANSITION
────────────────────────────── */
let currentPage = 'home';

function showPage(id) {
  if (id === currentPage) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const overlay = document.getElementById('page-transition');

  // Curtain down
  overlay.classList.remove('leaving');
  overlay.classList.add('entering');
  overlay.style.pointerEvents = 'all';

  setTimeout(() => {
    // Swap pages
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active', 'visible');
    });

    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      currentPage = id;
      window.scrollTo({ top: 0, behavior: 'instant' });
      updateActiveNavLink(id);

      // Slight delay then show new page
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.classList.add('visible');
          initReveal(); // re-init observers for new page
        });
      });
    }

    // Curtain up
    overlay.classList.remove('entering');
    overlay.classList.add('leaving');
    overlay.style.pointerEvents = 'none';

    setTimeout(() => {
      overlay.classList.remove('leaving');
    }, 500);

  }, 420);
}

function handleInitialRoute() {
  // Show home page on load
  const home = document.getElementById('home');
  if (home) {
    home.classList.add('active');
    setTimeout(() => {
      home.classList.add('visible');
      initReveal();
    }, 200);
  }
}

function updateActiveNavLink(pageId) {
  document.querySelectorAll('.nav-links a[data-page], .mobile-menu a[data-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });
}

// Expose globally for HTML onclick attributes
window.showPage = showPage;

/* ──────────────────────────────
   SCROLL REVEAL
────────────────────────────── */
let revealObserver = null;

function initReveal() {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observe all .reveal elements in active page
  const activePage = document.querySelector('.page.active');
  if (!activePage) return;

  activePage.querySelectorAll('.reveal').forEach(el => {
    // Reset if already observed before
    el.classList.remove('visible');
    revealObserver.observe(el);
  });
}

/* ──────────────────────────────
   FAQ ACCORDION
────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
}

// Re-init FAQ when switching pages (for pages that contain FAQ)
window.addEventListener('faqReady', initFaq);

/* ──────────────────────────────
   WORK FILTER BUTTONS
────────────────────────────── */
function initWorkFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  const items   = document.querySelectorAll('.work-item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;

      items.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => {
            item.style.display = '';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'none';
            });
          }, 120);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.94)';
          setTimeout(() => { item.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

/* ──────────────────────────────
   FORM SUBMIT
────────────────────────────── */
function initFormSubmit() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.submit-btn');
    const original = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#1a6b3a';
      btn.style.borderColor = '#1a6b3a';
      btn.style.color = 'var(--white)';

      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        form.reset();
      }, 3000);
    }, 1500);
  });
}

/* ──────────────────────────────
   SMOOTH SCROLL TO TOP ON NAV
────────────────────────────── */
document.querySelectorAll('a[href="#top"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ──────────────────────────────
   WORK ITEMS — transition handler
   (items default to visible)
────────────────────────────── */
document.querySelectorAll('.work-item').forEach(item => {
  item.style.transition = 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s';
});