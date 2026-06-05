# GWENDAL · Web No Oficial
## Guía de instalación y personalización

---

### Estructura del proyecto

```
gwendal-web/
│
├── index.html          ← Página principal
├── privacidad.html     ← Política de Privacidad
├── aviso-legal.html    ← Aviso Legal
├── cookies.html        ← Política de Cookies
├── style.css           ← Estilos (paleta, tipografía, layout)
├── script.js           ← Interacciones y animaciones
├── README.md           ← Esta guía
│
└── assets/
    └── img/            ← TUS fotografías van aquí
        ├── og-gwendal.jpg      (1200×630 px — Open Graph)
        ├── grupo.jpg           (800×1100 px — foto del grupo)
        ├── gal-01.jpg          (800×800 px — galería)
        ├── gal-02.jpg
        ├── gal-03.jpg
        ├── gal-04.jpg
        ├── gal-05.jpg
        ├── gal-06.jpg
        ├── gal-07.jpg
        ├── gal-08.jpg
        ├── disco-1976.jpg      (600×600 px — portadas)
        ├── disco-1977.jpg
        ├── disco-1983.jpg
        ├── disco-1987.jpg
        ├── disco-1994.jpg
        ├── disco-2005.jpg
        └── libro-portada.jpg   (500×750 px — portada del libro)
```

---

### Cómo publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo: `gwendal`)
2. Sube todos los archivos (index.html, style.css, script.js y la carpeta assets/)
3. Ve a Settings → Pages
4. En "Branch", selecciona `main` y carpeta `/ (root)`
5. Haz clic en Save
6. Tu web estará en: `https://gwendal.es/`

---

### Cómo añadir imágenes reales

En el HTML, busca los bloques `<div class="img-placeholder">` o `<div class="gal-placeholder">`
y sustitúyelos por etiquetas `<img>` normales.

**Ejemplo en la galería:**
```html
<!-- ANTES (placeholder) -->
<figure class="gallery-item gal-large">
  <div class="gal-placeholder" aria-label="...">
    ...
  </div>
  <figcaption class="gal-caption">En escena · Bretagne</figcaption>
</figure>

<!-- DESPUÉS (imagen real) -->
<figure class="gallery-item gal-large">
  <img src="assets/img/gal-01.jpg"
       alt="Gwendal en concierto · Bretagne"
       loading="lazy" />
  <figcaption class="gal-caption">En escena · Bretagne</figcaption>
</figure>
```

**Ejemplo en discografía:**
```html
<!-- ANTES -->
<div class="disc-cover-placeholder">
  <span>1976</span>
</div>

<!-- DESPUÉS -->
<img src="assets/img/disco-1976.jpg"
     alt="Portada del álbum Gwendal 1976"
     loading="lazy" />
```

---

### Cómo activar el formulario (envío real)

La web usa formularios estáticos. Para activar el envío de emails:

**Opción A — Formspree (gratis, recomendado):**
1. Regístrate en https://formspree.io
2. Crea un nuevo formulario y copia tu endpoint
3. En `index.html`, busca `<form class="libro-form"` y añade:
   - `action="https://formspree.io/f/TUCODIGO"`
   - `method="POST"`
4. Repite para el formulario de contacto

**Opción B — Netlify Forms:**
Si publicas en Netlify en lugar de GitHub Pages:
1. Añade `data-netlify="true"` a cada `<form>`
2. Netlify gestiona el envío automáticamente

---

### Personalización rápida

**Cambiar colores** → Edita las variables en `style.css`:
```css
:root {
  --c-gold:       #c9a84c;   /* Color dorado principal */
  --c-green-deep: #1a3020;   /* Verde oscuro de fondo */
  --c-atlantic:   #1c3a52;   /* Azul atlántico */
}
```

**Cambiar el email de contacto** → Busca en `index.html`:
```html
<a href="mailto:jose@jmlfoto.es">jose@jmlfoto.es</a>
```

**Actualizar redes sociales** → Busca `.social-link` en `index.html` y añade las URLs reales:
```html
<a href="https://facebook.com/gwendaloficial" class="social-link" ...>
```

**Cambiar la fecha de lanzamiento del libro** → Busca `.badge-date`:
```html
<span class="badge-date">Otoño 2025 · Disponible</span>
```

---

### SEO: qué debes actualizar

En `index.html`, líneas iniciales:

```html
<!-- Cambia por la URL real de tu GitHub Pages -->
<link rel="canonical" href="https://gwendal.es/" />
<meta property="og:url" content="https://gwendal.es/" />

<!-- Añade una imagen real para redes sociales -->
<meta property="og:image" content="assets/img/og-gwendal.jpg" />
```

---

### Compatibilidad

- Chrome / Edge 88+
- Firefox 85+
- Safari 14+
- Mobile: iOS Safari, Chrome Android
- Sin dependencias externas (solo Google Fonts)

---

### Créditos

Web diseñada para el proyecto editorial del libro oficial de Gwendal.
Fotografías y contenidos: archivo del grupo y fotógrafo oficial.

---

*Para cualquier modificación técnica o ampliación del proyecto,
contacta con el equipo editorial.*
