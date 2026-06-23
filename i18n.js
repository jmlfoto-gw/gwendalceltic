/* ============================================================
   i18n.js — Sistema de traducción trilingüe para gwendal.es
   Idiomas: es (español) · fr (français) · en (English)
   Autor: Jose Morales · jmlfoto
   ============================================================ */

(function () {
  'use strict';

  const LANGS      = ['es', 'fr', 'en'];
  const DEFAULT    = 'es';
  const STORAGE_KEY = 'gw-lang';

  /* ── 1. Detectar idioma inicial ─────────────────────────── */
  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGS.includes(stored)) return stored;
    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    if (browser === 'fr') return 'fr';
    if (browser === 'en') return 'en';
    return DEFAULT;
  }

  /* ── 2. Acceso a claves anidadas "a.b.c" ────────────────── */
  function getVal(obj, key) {
    return key.split('.').reduce(
      (acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined),
      obj
    );
  }

  /* ── 3. Aplicar traducciones al DOM ─────────────────────── */
  function applyTranslations(lang) {
    const t = window.GW_TRANSLATIONS && window.GW_TRANSLATIONS[lang];
    if (!t) { console.warn('[i18n] Traducciones no encontradas para:', lang); return; }

    /* textContent simple */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = getVal(t, el.dataset.i18n);
      if (val !== undefined) el.textContent = val;
    });

    /* innerHTML (para elementos con <em>, <br>, <strong>…) */
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const val = getVal(t, el.dataset.i18nHtml);
      if (val !== undefined) el.innerHTML = val;
    });

    /* placeholder de inputs y textarea */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const val = getVal(t, el.dataset.i18nPlaceholder);
      if (val !== undefined) el.placeholder = val;
    });

    /* aria-label */
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const val = getVal(t, el.dataset.i18nAria);
      if (val !== undefined) el.setAttribute('aria-label', val);
    });

    /* alt de imágenes */
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const val = getVal(t, el.dataset.i18nAlt);
      if (val !== undefined) el.alt = val;
    });

    /* Atributo title */
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const val = getVal(t, el.dataset.i18nTitle);
      if (val !== undefined) el.title = val;
    });
  }

  /* ── 4. Actualizar el selector visual ───────────────────── */
  function updateSwitcher(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('lang-btn--active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  /* ── 5. Cambiar idioma (punto de entrada público) ───────── */
  function setLang(lang) {
    if (!LANGS.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    applyTranslations(lang);
    updateSwitcher(lang);
    /* Disparar evento por si script.js necesita reaccionar */
    document.dispatchEvent(new CustomEvent('gw:langchange', { detail: { lang } }));
  }

  /* ── 6. Construir e inyectar el selector en el nav ───────── */
  function buildSwitcher() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;

    const li = document.createElement('li');
    li.className = 'lang-switcher';
    li.setAttribute('aria-label', 'Seleccionar idioma');
    li.innerHTML =
      '<button class="lang-btn" data-lang="es" aria-pressed="false" title="Español">ES</button>' +
      '<span class="lang-sep" aria-hidden="true">·</span>' +
      '<button class="lang-btn" data-lang="fr" aria-pressed="false" title="Français">FR</button>' +
      '<span class="lang-sep" aria-hidden="true">·</span>' +
      '<button class="lang-btn" data-lang="en" aria-pressed="false" title="English">EN</button>';

    /* Insertar antes del nav-cta (último li) */
    const lastLi = navMenu.querySelector('li:last-child');
    navMenu.insertBefore(li, lastLi);

    li.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
  }

  /* ── 7. Inicialización ──────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    buildSwitcher();
    setLang(detectLang());
  });

  /* Exponer API pública */
  window.GW_I18N = { setLang, detectLang };

})();
