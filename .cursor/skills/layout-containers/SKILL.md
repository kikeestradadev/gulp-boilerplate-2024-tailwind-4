---
name: layout-containers
description: >-
  Enforce Main Container (--main-container: 3500px) and Container
  (--container: 1600px) layout tokens via Tailwind max-w-[var(--token)].
  Use when creating or editing Pug/HTML sections, headers, footers, storybook
  modules, or any layout that needs max-width 3500px / 1600px containers.
---

# Layout Containers

## Tokens (`src/scss/tailwind.css` `:root`)

- `--main-container: 3500px` — outer wrapper (Main Container)
- `--container: 1600px` — inner content (Container)

## Always use

```pug
section(class="w-full max-w-[var(--main-container)] mx-auto px-[15px]")
	div(class="w-full max-w-[var(--container)] mx-auto")
```

```pug
header(class="w-full max-w-[var(--main-container)] mx-auto px-[15px]")
footer(class="w-full max-w-[var(--main-container)] mx-auto px-[15px]")
```

## Never use

- `max-w-[3500px]`
- `max-w-[1600px]`
- Hardcoded px values that duplicate these tokens

## Checklist when adding a section

1. Outer element → `w-full max-w-[var(--main-container)] mx-auto` (+ `px-[15px]` if Main Container)
2. Inner element → `w-full max-w-[var(--container)] mx-auto` (no side padding from this token)
3. Confirm tokens exist in `:root`; do not invent alternate max-widths for the same role
