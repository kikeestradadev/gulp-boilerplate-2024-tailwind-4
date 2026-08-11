---
name: create-static-json-module
description: >-
  Crea un módulo con seed JSON en public/data (fetch) y opcional form+grilla CRUD
  vía localStorage (npm run dev y GitHub Pages). Usar al pedir grillas fake,
  Submit que actualiza cards, o demos de datos sin backend real.
---

# Crear módulo JSON seed + grilla (y form opcional)

Referencia: `persona-grid` + `persona.json` + `persona-grid-data.json`.

Stack de estilos: **Tailwind 4** (no Sass). UI en `src/pug/components/`. Datos en `src/data/`.

## Modo solo lectura

1. `src/data/{name}.json` con colección (10–20 items).
2. Gulp `assets` copia a `public/data/`.
3. JS: `fetch('./data/{name}.json')` → render.

## Modo form + grilla CRUD (Pages-compatible)

1. Form + botones Editar / Eliminar en cada card.
2. `data-storage-key` (bump version si cambia el schema, p. ej. `-v2`).
3. Cada registro con `id`; create genera nuevo id.
4. JS: load seed/localStorage → create / update / delete → `localStorage` + re-render.
5. Sin API de escritura en `gulpfile.js`.

## Checklist

| Pieza | Ejemplo |
|-------|---------|
| Seed | `src/data/persona.json` → `public/data/persona.json` |
| Config UI | `src/data/persona-grid-data.json` (`dataUrl`, `storageKey`, `fields`) → local `personaGridData` |
| Pug | `src/pug/components/persona-grid.pug` (shell layout + Tailwind) |
| JS | `src/js/modules/personaGrid.js` en `initComponents` |

## Markup

Form primero; debajo toolbar + **grilla de cards** (`aria-live="polite"`); opcional preview JSON.

- Sintaxis Pug larga (`pug-long-syntax`).
- Shell `section` + main-container / container (`layout-containers`).
- Clases BEM de anclaje JS (`persona-grid__*`) + utilidades Tailwind.
- Botones con tokens `--btn-*` (ver style guide de botones).

## Tras crear

1. `npm run dev` → Submit → aparece card nueva.
2. Reload → sigue (localStorage).
3. Deploy Pages → misma UX en la demo del cliente.
