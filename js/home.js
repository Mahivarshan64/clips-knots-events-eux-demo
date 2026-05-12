/* CLIPS & KNOTS — home.js (index-specific effects) */

/* ============================================
   CUSTOM LAG CURSOR
   ============================================ */
(function initCursor() {
  const dot  = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring follows with smooth lerp
  (function lerpRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();

  // Expand cursor on interactive elements
  const targets = 'a, button, .svc-row, .p-item, input, select, textarea, .t-dot';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });
})();

/* ============================================
   NAVIGATION SCROLL STATE
   ============================================ */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================
   MOBILE MENU
   ============================================ */
(function initMenu() {
  const burger = document.querySelector('.nav-hamburger');
  const menu   = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================================
   HERO THEATRE-CURTAIN REVEAL
   ============================================ */
(function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  // Small delay so fonts are ready
  setTimeout(() => hero.classList.add('animate'), 80);
})();

/* ============================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================ */
(function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.sr').forEach(el => io.observe(el));
})();

/* ============================================
   TESTIMONIAL ROTATOR
   ============================================ */
(function initTestimonials() {
  const texts   = Array.from(document.querySelectorAll('.t-text'));
  const authors = Array.from(document.querySelectorAll('.t-author'));
  const dots    = Array.from(document.querySelectorAll('.t-dot'));
  if (!texts.length) return;

  let current = 0;
  let timer;

  function go(idx) {
    if (idx === current) return;
    texts[current].classList.remove('active');
    authors[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = idx;
    texts[current].classList.add('active');
    authors[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');

    restart();
  }

  function next() { go((current + 1) % texts.length); }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, 5500);
  }

  dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.idx)));
  restart();
})();

/* ============================================
   FORM VALIDATION
   ============================================ */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const clear = () => form.querySelectorAll('.fgroup').forEach(g => {
    g.classList.remove('has-err');
    const f = g.querySelector('input,select,textarea');
    if (f) f.classList.remove('err');
  });

  const markErr = f => {
    f.classList.add('err');
    f.closest('.fgroup').classList.add('has-err');
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    clear();
    let ok = true;

    form.querySelectorAll('[required]').forEach(f => {
      if (!f.value.trim()) { markErr(f); ok = false; }
    });

    if (!ok) { form.querySelector('.err')?.focus(); return; }

    const btn = form.querySelector('button[type="submit"]');
    const msg = form.querySelector('.form-success-msg');
    const orig = btn.textContent;
    btn.textContent = 'Sending...'; btn.disabled = true; btn.style.opacity = '.6';

    setTimeout(() => {
      btn.textContent = 'Sent'; btn.style.background = '#27ae60'; btn.style.color = '#fff';
      if (msg) { msg.style.display = 'block'; msg.textContent = 'Inquiry received. We\'ll reach out within 24 hours.'; }
      form.reset();
      setTimeout(() => {
        btn.textContent = orig; btn.disabled = false;
        btn.style.opacity = ''; btn.style.background = ''; btn.style.color = '';
        if (msg) msg.style.display = 'none';
      }, 4000);
    }, 1600);
  });

  form.querySelectorAll('input,select,textarea').forEach(f => {
    f.addEventListener('blur', function () {
      if (this.hasAttribute('required') && !this.value.trim()) markErr(this);
      else { this.classList.remove('err'); this.closest('.fgroup').classList.remove('has-err'); }
    });
  });
})();
