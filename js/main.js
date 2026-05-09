/* CLIPS & KNOTS EVENTS — main.js */

/* ============================================
   NAVIGATION SCROLL
   ============================================ */

const nav = document.querySelector('.nav');

if (nav) {
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================
   MOBILE MENU
   ============================================ */

const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });
}

/* ============================================
   HERO WORD ANIMATION
   ============================================ */

function animateHeroWords() {
  const words = document.querySelectorAll('.hero-title .word');
  words.forEach((word, i) => {
    word.style.animation = `wordReveal 0.65s cubic-bezier(0.4, 0, 0.2, 1) ${0.4 + i * 0.14}s forwards`;
  });
}

/* ============================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================ */

const revealObserver = new IntersectionObserver((entries) => {
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

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================
   FORM VALIDATION & SUBMISSION
   ============================================ */

function initForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const clearErrors = () => {
    form.querySelectorAll('.form-group').forEach(g => {
      g.classList.remove('has-error');
      const f = g.querySelector('input, select, textarea');
      if (f) f.classList.remove('error');
    });
  };

  const showError = (field) => {
    field.classList.add('error');
    field.closest('.form-group').classList.add('has-error');
  };

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        showError(field);
        valid = false;
      }
    });

    const emailField = form.querySelector('#email');
    if (emailField && emailField.value && !validateEmail(emailField.value)) {
      showError(emailField);
      valid = false;
    }

    if (!valid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Submit feedback
    const btn = form.querySelector('button[type="submit"]');
    const successEl = form.querySelector('.form-success');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.65';

    // Replace this timeout with a real fetch() to your backend
    setTimeout(() => {
      btn.textContent = 'Sent';
      btn.style.background = '#27ae60';
      btn.style.color = '#fff';

      if (successEl) {
        successEl.style.display = 'block';
        successEl.textContent = 'Inquiry received. We\'ll reach out within 24 hours.';
      }

      form.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.background = '';
        btn.style.color = '';
        if (successEl) successEl.style.display = 'none';
      }, 4000);
    }, 1600);
  });

  // Blur validation
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', function () {
      if (this.hasAttribute('required') && !this.value.trim()) {
        showError(this);
      } else {
        this.classList.remove('error');
        this.closest('.form-group').classList.remove('has-error');
      }
    });
  });
}

/* ============================================
   INIT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  animateHeroWords();
  initForm('contactForm');
  initForm('contactFormFull');
});
