---
name: review-rules-skills
description: >-
  Obligatorio al inicio de cualquier tarea en este repo: leer rules y skills
  relevantes de .cursor antes de editar Pug, CSS, JS, sliders o layout. Usar
  siempre antes de implementar, refactorizar o crear archivos.
---

# Revisar rules y skills primero

Antes de escribir o cambiar código en este proyecto, **para y revisa** las reglas del juego en `.cursor/`.

No implementes “de memoria”. Omisiones típicas: sintaxis Pug corta, shells sin `--main-container`/`--container`, tipografía sin tokens `:root`, módulos JS sin camelCase/`initComponents`, sliders sin convención Swiper.

## Checklist (obligatorio)

1. Lista lo que hay ahora:
   - Rules: `.cursor/rules/*.mdc`
   - Skills: `.cursor/skills/*/SKILL.md`
2. Según la tarea, **lee con Read** (no asumas el contenido) los que apliquen.
3. Solo después implementa, respetando lo leído.

## Mapa rápido

| Si tocas… | Lee primero |
|-----------|-------------|
| Cualquier CSS / Tailwind | `tailwind-v4-only` (rule + skill) |
| Variables `:root` / tipografía / colores en markup | `css-root-variables` |
| Layout / sections / modules Pug | `layout-containers` (rule + skill) |
| Plantillas Pug | `pug-long-syntax` (rule + skill), `pug-data-files` |
| Sliders / Swiper | `create-slider-data` + `javascript-modules` |
| JS en `src/js` | `javascript-modules` |

Si la tarea cruza varias capas (p. ej. un slider nuevo), lee **todos** los items del mapa que apliquen antes del primer edit.

## Reglas

1. No edites archivos de producto hasta completar el checklist.
2. Si un skill o rule contradice un hábito genérico (BEM, Tailwind 3, npm Swiper, etc.), gana el del repo.
3. Si creas un patrón nuevo reutilizable, actualiza o añade rule/skill en la misma sesión.
4. Tras cambios grandes, vuelve a contrastar el diff contra las rules leídas.
