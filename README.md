# GWENDAL · Sitio Web Oficial No Oficial

Sitio web dedicado al grupo bretón de música celta **Gwendal** y al próximo lanzamiento del libro *"Gwendal, 50 Años de Música Celta"*, escrito por el fotógrafo oficial del grupo, Jose Morales · jmlfoto.

🌐 **[gwendal.es](https://gwendal.es)**

---

## Sobre el proyecto

Este sitio es un **proyecto personal no oficial**, desarrollado por Jose Morales en su condición de fotógrafo habitual de Gwendal durante más de una década y autor del libro sobre la historia del grupo. No representa al grupo ni a su management (Actos Management · Marcos Valles).

El sitio tiene dos objetivos principales:

- Difundir la historia, la música y el legado del grupo Gwendal.
- Promocionar el lanzamiento del libro fotográfico y documental sobre sus cincuenta años de trayectoria.

---

## Estructura del proyecto

```
/
├── index.html          # Página principal
├── style.css           # Hoja de estilos global
├── privacidad.html     # Política de privacidad
├── aviso-legal.html    # Aviso legal
├── cookies.html        # Política de cookies
└── assets/
    ├── img/            # Imágenes y fotografías
    └── fonts/          # Fuentes tipográficas locales (si aplica)
```

---

## Secciones de la web

| Sección | ID | Descripción |
|---|---|---|
| Hero | `#inicio` | Portada con imagen panorámica y llamadas a la acción |
| Sobre Gwendal | `#sobre` | Historia y contexto del grupo |
| Formación | `#formacion` | Músicos actuales con biografías expandibles |
| Discografía | `#discografia` | Álbumes con portadas y descripción |
| Galería | `#galeria` | Fotografías de conciertos con lightbox |
| El Libro | `#libro` | Información del libro y formulario de lista de espera |
| Cronología | `#timeline` | Línea del tiempo interactiva 1972–2026 |
| Testimonios | `#testimonios` | Citas de músicos, prensa y seguidores |
| Noticias | `#noticias` | Seis hitos de prensa histórica y actualidad |
| Contacto | `#contacto` | Formulario, redes sociales y datos de management |

---

## Tecnologías utilizadas

- **HTML5** semántico con roles ARIA y accesibilidad WCAG
- **CSS3** con variables personalizadas, Grid, Flexbox y animaciones
- **JavaScript vanilla** — sin frameworks ni dependencias externas
- **GitHub Pages** — alojamiento estático con dominio personalizado
- **Formspree** — gestión de formularios (dos endpoints independientes)
- **Google Fonts** — tipografías Cinzel, Cinzel Decorative y Crimson Pro
- **Google Tag Manager** (GTM-PBCBSNM9) — analítica y seguimiento

---

## Funcionalidades JavaScript

- Menú de navegación sticky con toggle móvil
- Animaciones de aparición por scroll (IntersectionObserver)
- Galería con lightbox, navegación por flechas y soporte swipe táctil
- Formulario de lista de espera del libro (Formspree `maqzyzdg`)
- Formulario de contacto general (Formspree `mlgkekrd`)
- Banner de cookies con gestión por localStorage
- Botón de vuelta arriba
- Discografía con filtro por décadas

---

## SEO y metadatos

- Meta title, description y keywords
- Open Graph completo (título, descripción, imagen, URL, locale)
- Twitter Cards con imagen grande
- Schema.org `MusicGroup` con datos estructurados
- Etiquetas semánticas HTML5 (`header`, `main`, `section`, `article`, `footer`)
- URL canónica apuntando a `https://gwendal.es/`

---

## Formularios

| Formulario | Endpoint Formspree | Uso |
|---|---|---|
| Lista de espera del libro | `maqzyzdg` | Captura de email para aviso de lanzamiento |
| Contacto general | `mlgkekrd` | Mensajes y consultas generales |

Ambos endpoints son independientes e intencionales.

---

## Páginas legales

Todas las páginas legales usan `noindex, follow` para excluirlas de resultados de búsqueda.

- `privacidad.html` — Política de privacidad (RGPD)
- `aviso-legal.html` — Aviso legal con naturaleza no oficial del sitio
- `cookies.html` — Política de cookies con tabla de servicios de terceros

---

## Paleta de colores

| Variable | Valor | Uso |
|---|---|---|
| `--c-black` | `#0a0a0a` | Fondo principal |
| `--c-dark` | `#111111` | Fondos secundarios |
| `--c-gold` | `#c9a84c` | Acentos, títulos, ornamentos |
| `--c-gold-light` | `#e0c070` | Estados hover |
| `--c-green-mid` | `#3a6b4a` | Tags técnicos, acentos verdes |
| `--c-white` | `#f5f0e8` | Texto principal |
| `--c-grey-light` | `#b0a898` | Texto secundario |

---

## Tipografía

- **Cinzel Decorative** — Logo y títulos hero
- **Cinzel** — Títulos de sección, etiquetas, navegación
- **Crimson Pro** — Cuerpo de texto, excerpts, citas

---

## Contacto y management

**Gestión oficial de Gwendal (conciertos, prensa, contratación):**
Marcos Valles · Actos Management
📧 actosmanagement@gmail.com
📞 984 104 923
🌐 actosmanagement.com

**Autor del sitio y del libro:**
Jose Morales · jmlfoto
📧 jose@jmlfoto.es
🌐 jmlfoto.es

---

## Licencia

© 2026 Jose Morales · jmlfoto. Todos los derechos reservados.

Las fotografías son propiedad del autor salvo indicación contraria. El nombre **Gwendal** es marca registrada de sus titulares. Su uso en este sitio tiene carácter exclusivamente informativo y cultural.
