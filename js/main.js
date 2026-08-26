/* ==========================================================================
   The Mini CEO Bakery — JavaScript v2
   ==========================================================================
   1. Mobile navigation
   2. Smooth scroll
   3. Header shadow on scroll
   4. Scroll-reveal animations with stagger
   5. Animated counter for hero stats
   6. Tilt effect on menu cards
   7. Marquee duplication for seamless loop
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================
  // 1. MOBILE NAVIGATION
  // ========================

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  body.appendChild(overlay);

  function openMenu() {
    navLinks.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
    body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
    body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  // ========================
  // 2. SMOOTH SCROLL
  // ========================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ========================
  // 3. HEADER SCROLL EFFECT
  // ========================

  const header = document.querySelector('.site-header');

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ========================
  // 4. SCROLL REVEAL WITH STAGGER
  // ========================

  const revealTargets = document.querySelectorAll(
    '.menu-card, .delivery-zone-card, .step-card, .testimonial-card, ' +
    '.about-grid, .contact-card, .delivery-map-placeholder, .hero-stats, ' +
    '.about-values, .section-header'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  // Add stagger delays to grid children
  document.querySelectorAll('.menu-grid, .testimonials-grid, .steps-grid').forEach(grid => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.classList.add(`reveal-delay-${Math.min(i + 1, 5)}`);
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ========================
  // 5. ANIMATED COUNTERS
  // ========================

  const counters = document.querySelectorAll('.hero-stat-number[data-count]');
  let countersDone = false;

  function animateCounters() {
    if (countersDone) return;
    countersDone = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 1800;
      const startTime = performance.now();

      function updateCount(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCount);
    });
  }

  // Trigger counters when hero stats come into view
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ========================
  // 6. CARD TILT EFFECT
  // ========================

  const tiltCards = document.querySelectorAll('.menu-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ========================
  // 7. MARQUEE SEAMLESS LOOP
  // ========================

  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    // Duplicate the content for seamless looping
    const span = marqueeTrack.querySelector('span');
    if (span) {
      const clone = span.cloneNode(true);
      marqueeTrack.appendChild(clone);
    }
  }
});
