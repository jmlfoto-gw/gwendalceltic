/* ============================================================
   GWENDAL · WEB NO OFICIAL
   script.js · Interacciones y animaciones
   ============================================================ */

'use strict';

/* ─── UTILIDADES ────────────────────────────────────────────── */

/**
 * Selecciona un elemento del DOM
 */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/**
 * Ejecuta una función cuando el DOM esté listo
 */
const onReady = (fn) => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};


/* ─── NAVEGACIÓN STICKY ─────────────────────────────────────── */

const initNav = () => {
  const header = $('#nav-header');
  const toggle = $('#nav-toggle');
  const menu   = $('#nav-menu');

  if (!header) return;

  // Scroll: añade clase 'scrolled' al header
  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // estado inicial

  // Toggle menú móvil
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      // Bloquea scroll del body cuando el menú está abierto
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cierra al hacer clic en un enlace del menú
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Cierra con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // Marca el enlace activo según la sección visible
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const markActiveLink = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', markActiveLink, { passive: true });
};


/* ─── SCROLL REVEAL ─────────────────────────────────────────── */

const initReveal = () => {
  const elements = $$('.reveal');
  if (!elements.length) return;

  // Respeta prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Pequeño delay escalonado para grupos de elementos
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  // Añade delays escalonados a elementos hermanos
  const groups = {};
  elements.forEach(el => {
    const parent = el.parentElement;
    const key = parent ? parent.className : 'root';
    if (!groups[key]) groups[key] = [];
    groups[key].push(el);
  });

  Object.values(groups).forEach(group => {
    group.forEach((el, i) => {
      if (!el.dataset.delay) {
        el.dataset.delay = i * 80;
      }
    });
  });

  elements.forEach(el => observer.observe(el));
};


/* ─── PARALLAX LIGERO EN HERO ───────────────────────────────── */

const initParallax = () => {
  const hero = $('.hero');
  if (!hero) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH = hero.offsetHeight;

        if (scrollY < heroH) {
          const factor = scrollY * 0.25;
          const heroBg = hero.querySelector('.hero-bg');
          const heroContent = hero.querySelector('.hero-content');

          if (heroBg) {
            heroBg.style.transform = `translateY(${factor}px)`;
          }
          if (heroContent) {
            heroContent.style.transform = `translateY(${scrollY * 0.08}px)`;
            heroContent.style.opacity = 1 - (scrollY / heroH) * 1.2;
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
};

/* ─── FILTRO DISCOGRAFÍA ────────────────────────────────────── */

const initDiscFilter = () => {
  const buttons = $$('.filter-btn');
  const items   = $$('.disc-item');
  if (!buttons.length || !items.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Estado activo
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Muestra/oculta con animación
      items.forEach(item => {
        const decade = item.dataset.decade;
        const show = filter === 'all' || decade === filter;

        if (show) {
          item.classList.remove('hidden');
          // Re-trigger reveal si ya fue revelado
          requestAnimationFrame(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          });
        } else {
          item.classList.add('hidden');
          item.style.opacity = '';
          item.style.transform = '';
          item.style.transition = '';
        }
      });
    });
  });
};

/* ─── DISCOGRAFÍA: modal de fichas ─────────────────────────── */
const initDiscografiaModal = () => {
  const items = $$('.disc-item');
  const modal = $('#disc-modal');
  const modalImage = $('#disc-modal-image');
  const modalYear = $('#disc-modal-year');
  const modalTitle = $('#disc-modal-title');
  const modalText = $('#disc-modal-text');
  const closeBtn = $('#disc-modal-close');

  if (!items.length || !modal || !modalImage || !modalYear || !modalTitle || !modalText || !closeBtn) return;

  let lastFocusedElement = null;

  const openModal = (item) => {
    const img = item.querySelector('.disc-cover img');
    const year = item.querySelector('.disc-year');
    const title = item.querySelector('.disc-name');
    const desc = item.querySelector('.disc-desc');

    if (!img || !year || !title || !desc) return;

    lastFocusedElement = document.activeElement;

    modalImage.src = img.src;
    modalImage.alt = img.alt || title.textContent.trim();
    modalYear.textContent = year.textContent.trim();
    modalTitle.textContent = title.textContent.trim();
    modalText.innerHTML = `<p>${desc.textContent.trim()}</p>`;

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    requestAnimationFrame(() => {
      modal.classList.add('is-open');
    });

    closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      modal.hidden = true;
      modalImage.src = '';
      modalImage.alt = '';
      modalYear.textContent = '';
      modalTitle.textContent = '';
      modalText.innerHTML = '';
      document.body.classList.remove('modal-open');

      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }, 250);
  };

  items.forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-haspopup', 'dialog');
    item.style.cursor = 'pointer';

    item.addEventListener('click', () => openModal(item));

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(item);
      }
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-disc-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;

    if (e.key === 'Escape') {
      closeModal();
    }
  });
};

/* ─── FORMULARIO LIBRO ──────────────────────────────────────── */

const initLibroForm = () => {
  const form    = $('#libro-form');
  const success = $('#form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación
    const nombre  = form.querySelector('#libro-nombre');
    const email   = form.querySelector('#libro-email');
    const consent = form.querySelector('#libro-consent');
    let valid = true;

    clearErrors(form);

    if (!nombre.value.trim()) {
      showError(nombre, 'Por favor, introduce tu nombre');
      valid = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError(email, 'Por favor, introduce un email válido');
      valid = false;
    }

    if (!consent.checked) {
      showError(consent, 'Debes aceptar las comunicaciones');
      valid = false;
    }

    // Si hay errores, para aquí
    if (!valid) return;

    // Si todo está bien, envía a Formspree
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        // Envío correcto
        form.reset();
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        alert('Hubo un problema al enviar. Inténtalo de nuevo.');
      }
    })
    .catch(() => {
      alert('No se pudo conectar. Comprueba tu conexión a internet.');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-icon">◈</span> Avísame del Lanzamiento';
    });

  });
};


/* ─── FORMULARIO CONTACTO ───────────────────────────────────── */

const initContactoForm = () => {
  const form    = $('#contacto-form');
  const success = $('#contact-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación
    const nombre  = form.querySelector('#c-nombre');
    const email   = form.querySelector('#c-email');
    const asunto  = form.querySelector('#c-asunto');
    const mensaje = form.querySelector('#c-mensaje');
    let valid = true;

    clearErrors(form);

    if (!nombre.value.trim()) {
      showError(nombre, 'Por favor, introduce tu nombre');
      valid = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError(email, 'Por favor, introduce un email válido');
      valid = false;
    }

    if (!asunto.value) {
      showError(asunto, 'Selecciona un asunto');
      valid = false;
    }

    if (!mensaje.value.trim() || mensaje.value.trim().length < 10) {
      showError(mensaje, 'El mensaje debe tener al menos 10 caracteres');
      valid = false;
    }

    // Si hay errores, para aquí
    if (!valid) return;

    // Si todo está bien, envía a Formspree
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        // Envío correcto
        form.reset();
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        // Error del servidor
        alert('Hubo un problema al enviar el mensaje. Inténtalo de nuevo.');
      }
    })
    .catch(() => {
      // Error de conexión
      alert('No se pudo conectar. Comprueba tu conexión a internet.');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-icon">◈</span> Enviar Mensaje';
    });

  });
};


/* ─── HELPERS DE FORMULARIOS ────────────────────────────────── */

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const showError = (field, message) => {
  field.setAttribute('aria-invalid', 'true');
  field.style.borderColor = '#c0392b';

  const err = document.createElement('span');
  err.className = 'field-error';
  err.setAttribute('role', 'alert');
  err.textContent = message;
  err.style.cssText = `
    display: block;
    font-size: 0.75rem;
    color: #e07070;
    margin-top: 0.3rem;
    font-family: var(--f-title, serif);
    letter-spacing: 0.03em;
  `;

  field.parentNode.appendChild(err);
};

const clearErrors = (form) => {
  form.querySelectorAll('.field-error').forEach(el => el.remove());
  form.querySelectorAll('[aria-invalid]').forEach(el => {
    el.removeAttribute('aria-invalid');
    el.style.borderColor = '';
  });
};


/* ─── BACK TO TOP ───────────────────────────────────────────── */

const initBackToTop = () => {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.hidden = false;
    } else {
      btn.hidden = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};


/* ─── SMOOTH SCROLL para enlaces internos ───────────────────── */

const initSmoothScroll = () => {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = $(href);
      if (!target) return;

      e.preventDefault();

      const headerH = $('#nav-header')?.offsetHeight || 70;
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerH - 10;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
};


/* ─── CURSOR CUSTOM LIGERO ──────────────────────────────────── */

const initCursor = () => {
  // Solo en desktop y sin reduced motion
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isMobile || prefersReduced) return;

  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: var(--c-gold, #c9a84c);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease, opacity 0.3s ease;
    mix-blend-mode: screen;
    opacity: 0;
  `;
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '0.7';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  // Efecto hover en elementos interactivos
  const interactives = $$('a, button, .disc-item, .gallery-item, .hito');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(3)';
      cursor.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.opacity = '0.7';
    });
  });

  const animateCursor = () => {
    // Lerp suave
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    cursor.style.left = `${curX}px`;
    cursor.style.top  = `${curY}px`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
};


/* ─── CONTADOR ANIMADO ──────────────────────────────────────── */

const initCounters = () => {
  const stats = $$('.stat strong');
  if (!stats.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const animateValue = (el, start, end, duration, suffix) => {
    const startTime = performance.now();
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(start + (end - start) * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;

          if (text.includes('50+')) {
            animateValue(el, 0, 50, 1500, '+');
          } else if (text.includes('20+')) {
            animateValue(el, 0, 20, 1200, '+');
          }

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(el => observer.observe(el));
};


/* ─── LÍNEA DEL TIEMPO: hover interactivo ───────────────────── */

const initTimeline = () => {
  const items = $$('.tl-item');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const dot = item.querySelector('.tl-dot');
      if (dot) {
        dot.style.transform = 'scale(1.6)';
        dot.style.boxShadow = '0 0 0 6px rgba(201,168,76,0.3), 0 0 30px rgba(201,168,76,0.6)';
      }
    });

    item.addEventListener('mouseleave', () => {
      const dot = item.querySelector('.tl-dot');
      if (dot) {
        dot.style.transform = '';
        dot.style.boxShadow = '';
      }
    });
  });
};


/* ─── GALERÍA: lightbox básico ──────────────────────────────── */

const initGallery = () => {
  const items = $$('.gallery-item');
  if (!items.length) return;

  // Recoge todas las imágenes de la galería en orden
  const images = [];
  items.forEach(item => {
    const img = item.querySelector('img');
    const caption = item.querySelector('figcaption');
    if (img) {
      images.push({
        src: img.src,
        alt: img.alt || 'Fotografía Gwendal',
        caption: caption ? caption.textContent : ''
      });
    }
  });

  let currentIndex = 0;

  // ── Construcción del lightbox ──────────────────────────────

  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Vista ampliada de fotografía');
  lightbox.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.96);
    z-index: 2000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  `;

  const lightboxInner = document.createElement('div');
  lightboxInner.style.cssText = `
    max-width: 1000px;
    width: 100%;
    text-align: center;
    position: relative;
  `;

  // Imagen principal
  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = `
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 6px;
    display: block;
    margin: 0 auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    transition: opacity 0.25s ease;
  `;
  lightboxImg.setAttribute('alt', '');

  // Pie de foto
  const lightboxCaption = document.createElement('p');
  lightboxCaption.style.cssText = `
    font-family: 'Cinzel', serif;
    font-size: 0.8rem;
    letter-spacing: 0.15em;
    color: rgba(201,168,76,0.8);
    margin-top: 1.2rem;
    text-transform: uppercase;
    min-height: 1.5rem;
  `;

  // Contador  "2 / 8"
  const lightboxCounter = document.createElement('span');
  lightboxCounter.style.cssText = `
    position: absolute;
    top: -2.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    color: rgba(201,168,76,0.6);
  `;

  // Botón cerrar
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.setAttribute('aria-label', 'Cerrar galería');
  closeBtn.style.cssText = `
    position: absolute;
    top: -1rem;
    right: -1rem;
    background: #c9a84c;
    color: #0a0c0b;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 0.9rem;
    cursor: pointer;
    font-weight: bold;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  // Botón anterior
  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '&#8592;';
  prevBtn.setAttribute('aria-label', 'Fotografía anterior');
  prevBtn.style.cssText = `
    position: fixed;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(201,168,76,0.15);
    border: 1px solid rgba(201,168,76,0.4);
    color: #c9a84c;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 1.4rem;
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  // Botón siguiente
  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = '&#8594;';
  nextBtn.setAttribute('aria-label', 'Fotografía siguiente');
  nextBtn.style.cssText = `
    position: fixed;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(201,168,76,0.15);
    border: 1px solid rgba(201,168,76,0.4);
    color: #c9a84c;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 1.4rem;
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  // Hover en botones de navegación
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(201,168,76,0.35)';
      btn.style.borderColor = '#c9a84c';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(201,168,76,0.15)';
      btn.style.borderColor = 'rgba(201,168,76,0.4)';
    });
  });

  // Monta el lightbox
  lightboxInner.appendChild(lightboxCounter);
  lightboxInner.appendChild(closeBtn);
  lightboxInner.appendChild(lightboxImg);
  lightboxInner.appendChild(lightboxCaption);
  lightbox.appendChild(prevBtn);
  lightbox.appendChild(lightboxInner);
  lightbox.appendChild(nextBtn);
  document.body.appendChild(lightbox);

  // ── Función para mostrar una imagen por índice ─────────────

  const showImage = (index) => {
    // Fade out
    lightboxImg.style.opacity = '0';

    setTimeout(() => {
      const item = images[index];
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightboxCaption.textContent = item.caption;
      lightboxCounter.textContent = `${index + 1} / ${images.length}`;

      // Fade in
      lightboxImg.style.opacity = '1';
    }, 220);
  };

  // ── Abrir lightbox ─────────────────────────────────────────

  items.forEach((item, index) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.style.cursor = 'pointer';

    const openLightbox = () => {
      currentIndex = index;
      showImage(currentIndex);

      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      lightbox.style.opacity = '0';
      requestAnimationFrame(() => {
        lightbox.style.transition = 'opacity 0.3s ease';
        lightbox.style.opacity = '1';
      });

      closeBtn.focus();
    };

    item.addEventListener('click', openLightbox);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox();
      }
    });
  });

  // ── Navegación ─────────────────────────────────────────────

  const goNext = () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  };

  const goPrev = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  };

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goNext();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goPrev();
  });

  // ── Cerrar lightbox ────────────────────────────────────────

  const closeLightbox = () => {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      lightbox.style.display = 'none';
      lightbox.style.opacity = '1';
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }, 300);
  };

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  // Clic en el fondo oscuro cierra
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ── Teclado ────────────────────────────────────────────────

  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'none') return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });

  // ── Swipe táctil (móvil) ───────────────────────────────────

  let touchStartX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
  }, { passive: true });

};

/* ─── EFECTO TYPING EN EL HERO ──────────────────────────────── */

const initHeroTyping = () => {
  const tagline = $('.hero-tagline');
  if (!tagline) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Subrayado dorado animado bajo "GWENDAL"
  const titleMain = $('.hero-title-main');
  if (titleMain) {
    titleMain.style.cssText += `
      background: linear-gradient(
        to right,
        transparent 0%,
        transparent 50%,
        rgba(201,168,76,0.15) 50%,
        rgba(201,168,76,0.15) 100%
      );
      background-size: 200% 100%;
      background-position: 0% center;
      -webkit-background-clip: text;
      background-clip: text;
      transition: background-position 1.5s ease 1s;
    `;

    setTimeout(() => {
      titleMain.style.backgroundPosition = '-100% center';
    }, 100);
  }
};


/* ─── ORNAMENTOS CELTAS SVG ─────────────────────────────────── */

const injectCelticOrnaments = () => {
  // Añade un divisor ornamental SVG celta entre secciones importantes
  const ornamentSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 20" 
         aria-hidden="true" focusable="false"
         style="display:block; width:100%; max-width:300px; margin:0 auto; opacity:0.4;">
      <path d="M0 10 Q25 2 50 10 Q75 18 100 10 Q125 2 150 10 Q175 18 200 10" 
            fill="none" stroke="rgba(201,168,76,0.8)" stroke-width="1"/>
      <circle cx="100" cy="10" r="3" fill="rgba(201,168,76,0.8)"/>
      <circle cx="50"  cy="10" r="2" fill="rgba(201,168,76,0.6)"/>
      <circle cx="150" cy="10" r="2" fill="rgba(201,168,76,0.6)"/>
    </svg>
  `;

  // Inyecta tras los encabezados de sección donde hay .section-ornament
  $$('.section-ornament').forEach(el => {
    el.insertAdjacentHTML('afterend', ornamentSVG);
  });
};


/* ─── PRELOADER LIGERO ──────────────────────────────────────── */

const initPreloader = () => {
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  preloader.setAttribute('aria-hidden', 'true');
  preloader.style.cssText = `
    position: fixed;
    inset: 0;
    background: #0a0c0b;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.6s ease, visibility 0.6s ease;
  `;
  preloader.innerHTML = `
    <div style="text-align:center;">
      <div style="
        font-family: 'Cinzel Decorative', serif;
        font-size: 2rem;
        letter-spacing: 0.3em;
        color: #c9a84c;
        animation: pulse 1s ease-in-out infinite alternate;
      ">GWENDAL</div>
      <div style="
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #c9a84c, transparent);
        margin: 1rem auto 0;
        animation: shimmer 1.5s ease-in-out infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        from { opacity: 0.4; }
        to   { opacity: 1; }
      }
      @keyframes shimmer {
        0%   { transform: scaleX(0.3); opacity: 0.4; }
        50%  { transform: scaleX(1); opacity: 1; }
        100% { transform: scaleX(0.3); opacity: 0.4; }
      }
    </style>
  `;

  document.body.prepend(preloader);

  // Oculta tras la carga
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => preloader.remove(), 650);
    }, 400);
  });
};


/* ─── TOOLTIP EN DISCOS ─────────────────────────────────────── */

const initDiscTooltips = () => {
  const items = $$('.disc-item');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.cursor = 'pointer';
    });
  });
};


/* ─── SCROLL INDICATOR PROGRESS ────────────────────────────── */

const initScrollProgress = () => {
  const bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #2d5c3a, #c9a84c, #264d6b);
    z-index: 1001;
    transition: width 0.1s linear;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? (scrollTop / docH) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, { passive: true });
};


/* ─── LAZY LOAD IMÁGENES (cuando se añadan reales) ──────────── */

const initLazyLoad = () => {
  // Prepara la carga diferida para imágenes con data-src
  const lazyImages = $$('img[data-src]');
  if (!lazyImages.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '200px 0px' }
  );

  lazyImages.forEach(img => observer.observe(img));
};


/* ─── INSTRUCCIONES: cómo añadir imágenes reales ───────────── */

/*
  PARA AÑADIR IMÁGENES REALES:
  ─────────────────────────────
  1. Crea la carpeta assets/img/ en tu repositorio GitHub
  2. Sube tus fotografías JPG/WebP
  3. Reemplaza los divs .img-placeholder, .gal-placeholder, 
     .disc-cover-placeholder y .libro-cover-placeholder
     por etiquetas <img src="assets/img/nombre.jpg" alt="descripción" loading="lazy" />
  
  Ejemplo de reemplazo en galería:
  <figure class="gallery-item gal-large">
    <img src="assets/img/gal-01.jpg" alt="Gwendal en concierto" loading="lazy" />
    <figcaption class="gal-caption">En escena · Bretagne</figcaption>
  </figure>

  Tamaños recomendados:
  - Hero: 1920x1080 px (o usa un vídeo en loop sin sonido)
  - Galería grande: 800x800 px
  - Galería pequeña: 400x400 px
  - Portada disco: 600x600 px
  - Portada libro: 500x750 px
  - Grupo/retrato: 800x1100 px
*/


/* ─── EASTER EGG CELTA ──────────────────────────────────────── */

const initEasterEgg = () => {
  // Konami code → mensaje celta
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                 'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === code[pos]) {
      pos++;
      if (pos === code.length) {
        pos = 0;
        const msg = document.createElement('div');
        msg.setAttribute('aria-live', 'polite');
        msg.style.cssText = `
          position: fixed;
          bottom: 5rem;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #1a3020, #264d6b);
          border: 1px solid rgba(201,168,76,0.5);
          color: #c9a84c;
          font-family: 'Cinzel', serif;
          font-size: 0.9rem;
          letter-spacing: 0.15em;
          padding: 1rem 2rem;
          border-radius: 8px;
          z-index: 5000;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0,0,0,0.6);
          animation: fadeInUp 0.4s ease;
        `;
        msg.innerHTML = `
          ✦ KENAVO · HASTA LA PRÓXIMA ✦<br />
          <span style="font-size:0.75rem; opacity:0.7; letter-spacing:0.1em;">
            Música que viaja desde Bretaña hasta tu corazón
          </span>
        `;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 4000);
      }
    } else {
      pos = 0;
    }
  });
};


/* ─── ACCESIBILIDAD: foco visible ───────────────────────────── */

const initAccessibility = () => {
  // Añade clase cuando se usa teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // Skip to main
  const skip = document.createElement('a');
  skip.href = '#sobre';
  skip.className = 'skip-link';
  skip.textContent = 'Saltar al contenido principal';
  skip.style.cssText = `
    position: absolute;
    top: -100px;
    left: 1rem;
    background: var(--c-gold, #c9a84c);
    color: #0a0c0b;
    padding: 0.5rem 1.2rem;
    border-radius: 4px;
    font-family: 'Cinzel', serif;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    z-index: 9999;
    transition: top 0.3s ease;
    text-decoration: none;
  `;
  skip.addEventListener('focus', () => { skip.style.top = '1rem'; });
  skip.addEventListener('blur',  () => { skip.style.top = '-100px'; });
  document.body.prepend(skip);
};

/* ─── FORMACIÓN: tarjetas desplegables ──────────────────────── */

const initFormacion = () => {
  const cards = $$('.musico-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const bio    = card.querySelector('.musico-bio');
    const cerrar = card.querySelector('.musico-cerrar');

    // Clic en la tarjeta abre o cierra
    card.addEventListener('click', (e) => {
      // Si se clicó el botón cerrar, solo cierra
      if (e.target === cerrar || cerrar.contains(e.target)) {
        card.classList.remove('activo');
        bio.setAttribute('aria-hidden', 'true');
        return;
      }

      const estaActivo = card.classList.contains('activo');

      // Cierra todas las demás
      cards.forEach(c => {
        c.classList.remove('activo');
        c.querySelector('.musico-bio')
         .setAttribute('aria-hidden', 'true');
      });

      // Abre esta si estaba cerrada
      if (!estaActivo) {
        card.classList.add('activo');
        bio.setAttribute('aria-hidden', 'false');

        // Scroll suave para que se vea bien en móvil
        setTimeout(() => {
          card.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }, 300);
      }
    });

    // Accesibilidad teclado
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-expanded', 'false');

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
        card.setAttribute(
          'aria-expanded',
          card.classList.contains('activo') ? 'true' : 'false'
        );
      }
    });
  });
};

/* ─── INIT: ARRANQUE PRINCIPAL ──────────────────────────────── */

onReady(() => {
  // Preloader (form,acion actual)
  initFormacion();

  // Preloader (primero de todo)
  initPreloader();

  // Navegación
  initNav();

  // Scroll suave
  initSmoothScroll();

  // Scroll reveal
  initReveal();

  // Parallax hero
  initParallax();

  // Filtro discografía
  initDiscFilter();
  initDiscografiaModal();

  // Formulario libro
  initLibroForm();

  // Formulario contacto
  initContactoForm();

  // Back to top
  initBackToTop();

  // Cursor personalizado
  initCursor();

  // Contadores animados
  initCounters();

  // Línea del tiempo interactiva
  initTimeline();

    // Galería con lightbox
  initGallery();

  // Hero efecto título
  initHeroTyping();

  // Ornamentos SVG celtas
  injectCelticOrnaments();

  // Barra de progreso
  initScrollProgress();

  // Lazy load imágenes
  initLazyLoad();

  // Accesibilidad
  initAccessibility();

  // Tooltips discos
  initDiscTooltips();

  // Easter egg
  initEasterEgg();

  console.log(
    '%c✦ GWENDAL · Música Celta Bretona ✦',
    'color: #c9a84c; font-family: serif; font-size: 14px; letter-spacing: 3px;'
  );
});

/* ── Banner de cookies ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieClose  = document.getElementById('cookie-close');

  if (!cookieBanner) return;

  // Mostrar si no ha aceptado antes
  if (!localStorage.getItem('cookies-accepted')) {
    cookieBanner.style.display = 'flex';
  }

  const closeBanner = () => {
    cookieBanner.style.opacity = '0';
    cookieBanner.style.transform = 'translateX(-50%) translateY(1rem)';
    setTimeout(() => { cookieBanner.style.display = 'none'; }, 300);
  };

  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookies-accepted', 'true');
    closeBanner();
  });

  cookieClose.addEventListener('click', closeBanner);
});