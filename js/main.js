// ============================================
// VICFADES VISIONARY STUDIO - main.js
// ============================================

function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = menuBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  });
}

function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

function updateOpenStatus() {
  const statusEl = document.getElementById('open-status');
  if (!statusEl) return;

  const now = new Date();
  const day = now.getDay();
  const time = now.getHours() * 100 + now.getMinutes();

  const hours = {
    0: [800, 2000],
    1: [800, 2000],
    2: [800, 2000],
    3: [800, 2000],
    4: [800, 2000],
    5: [800, 2200],
    6: [800, 2200]
  };

  const todayHours = hours[day];
  if (!todayHours) {
    statusEl.innerHTML = '<span class="status-dot status-closed"></span> <span class="text-red-400 font-medium text-sm">Closed</span>';
    return;
  }

  const [open, close] = todayHours;
  if (time >= open && time < close) {
    statusEl.innerHTML = '<span class="status-dot status-open"></span> <span class="text-green-400 font-medium text-sm">Open Now</span>';
  } else {
    statusEl.innerHTML = '<span class="status-dot status-closed"></span> <span class="text-red-400 font-medium text-sm">Closed</span>';
  }
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> Sending...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
      });

      if (response.ok) {
        form.innerHTML =
          '<div class="text-center py-12">' +
            '<div class="text-green-400 text-4xl mb-4"><i class="fa-solid fa-check-circle"></i></div>' +
            '<h3 class="font-display text-2xl tracking-wider uppercase text-chalk mb-2">Message Sent</h3>' +
            '<p class="text-chalk/40 text-sm">We\'ll get back to you soon.</p>' +
          '</div>';
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      btn.disabled = false;
      btn.innerHTML = originalText;
      alert('Something went wrong. Please call us directly at (848) 992-5012.');
    }
  });
}

function initStickyHeader() {
  const header = document.getElementById('header');
  const banner = document.querySelector('.ownership-banner');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.top = '0';
      header.style.backgroundColor = 'rgba(27, 20, 16, 0.95)';
      header.style.backdropFilter = 'blur(12px)';
      header.style.boxShadow = '0 1px 0 rgba(212, 168, 67, 0.1)';
    } else {
      header.style.top = banner ? banner.offsetHeight + 'px' : '0';
      header.style.backgroundColor = 'transparent';
      header.style.backdropFilter = 'none';
      header.style.boxShadow = 'none';
    }
  });
}

function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const chevron = btn.querySelector('.faq-chevron');
      const isOpen = answer.classList.contains('open');

      document.querySelectorAll('.faq-answer.open').forEach(a => {
        a.classList.remove('open');
        a.previousElementSibling.querySelector('.faq-chevron').classList.remove('open');
      });

      if (!isOpen) {
        answer.classList.add('open');
        chevron.classList.add('open');
      }
    });
  });
}

function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const lightboxVideo = lightbox.querySelector('video');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  const items = document.querySelectorAll('.gallery-item[data-src]');
  let currentIndex = 0;

  function showItem(index) {
    currentIndex = index;
    const item = items[index];
    const src = item.dataset.src;
    const type = item.dataset.type || 'image';

    if (type === 'video') {
      lightboxImg.style.display = 'none';
      lightboxVideo.style.display = 'block';
      lightboxVideo.src = src;
      lightboxVideo.play();
    } else {
      lightboxVideo.style.display = 'none';
      lightboxVideo.pause();
      lightboxImg.style.display = 'block';
      lightboxImg.src = src;
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxVideo.pause();
    lightboxVideo.src = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => showItem(i));
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showItem((currentIndex - 1 + items.length) % items.length);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showItem((currentIndex + 1) % items.length);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showItem((currentIndex - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight') showItem((currentIndex + 1) % items.length);
  });
}

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let current = 0;
        const increment = Math.ceil(target / 50);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current.toLocaleString();
        }, 25);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function initBilingualToggle() {
  const toggle = document.getElementById('lang-toggle');
  if (!toggle) return;

  const savedLang = localStorage.getItem('vicfades-lang') || 'en';
  setLanguage(savedLang);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-lang') || 'en';
    const next = current === 'en' ? 'es' : 'en';
    setLanguage(next);
    localStorage.setItem('vicfades-lang', next);
  });
}

function setLanguage(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  const toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.textContent = lang === 'en' ? 'ES' : 'EN';
  }

  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = lang === 'en' ? el.dataset.en : (el.dataset.es || el.dataset.en);
  });
}

function initReviewsSwipe() {
  const track = document.querySelector('.reviews-track');
  if (!track) return;

  // Kill CSS animation entirely -- we'll drive everything with JS
  track.style.animation = 'none';

  const totalWidth = track.scrollWidth / 2; // half because of duplicated cards
  let position = 0;
  let velocity = -0.5; // auto-scroll speed (px per frame)
  let isDragging = false;
  let startX = 0;
  let dragStartPos = 0;
  let lastX = 0;
  let dragVelocity = 0;
  let rafId = null;

  function tick() {
    if (!isDragging) {
      // Apply drag momentum or default scroll
      if (Math.abs(dragVelocity) > 0.5) {
        position += dragVelocity;
        dragVelocity *= 0.95; // friction
      } else {
        dragVelocity = 0;
        position += velocity;
      }
    }

    // Loop seamlessly
    if (position <= -totalWidth) position += totalWidth;
    if (position > 0) position -= totalWidth;

    track.style.transform = 'translateX(' + position + 'px)';
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  function startDrag(x) {
    isDragging = true;
    lastX = x;
    dragVelocity = 0;
  }

  function moveDrag(x) {
    if (!isDragging) return;
    var diff = x - lastX;
    dragVelocity = diff;
    position += diff;
    lastX = x;
  }

  function endDrag() {
    isDragging = false;
  }

  // Mouse
  track.addEventListener('mousedown', function(e) {
    e.preventDefault();
    startDrag(e.clientX);
  });
  window.addEventListener('mousemove', function(e) {
    moveDrag(e.clientX);
  });
  window.addEventListener('mouseup', endDrag);

  // Touch
  track.addEventListener('touchstart', function(e) {
    startDrag(e.touches[0].clientX);
  }, { passive: true });
  track.addEventListener('touchmove', function(e) {
    moveDrag(e.touches[0].clientX);
  }, { passive: true });
  track.addEventListener('touchend', endDrag);
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initRevealAnimations();
  updateOpenStatus();
  initContactForm();
  initStickyHeader();
  initFAQ();
  initGalleryLightbox();
  initCounters();
  initBilingualToggle();
  initReviewsSwipe();
});
