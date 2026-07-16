---
name: pug-long-syntax
description: >-
  Enforce explicit long-form Pug syntax. Use when creating or editing Pug
  templates, components, layout sections, storybook modules, or dynamic Pug
  markup in this project.
---

# Pug Long Syntax

## Instructions

Use explicit Pug attributes for all classes and dynamic values.

Prefer:

```pug
header(class='fixed top-0 left-0 z-10 w-full max-w-[var(--main-container)] mx-auto px-[15px] bg-[var(--base-color)] min-h-[var(--header-height)]')
section(class="w-full max-w-[var(--main-container)] mx-auto px-[15px]")
div(class="w-full max-w-[var(--container)] mx-auto")
```

Avoid:

```pug
header.fixed.top-0.left-0.z-10.w-full
section.w-full.max-w-[var(--main-container)].mx-auto
.container
```

## Checklist

1. Use `tag(class="...")` or `tag(class='...')`.
2. Do not use shorthand `tag.class`, `tag#id`, or `.class`.
3. Keep Tailwind utilities, CSS variables, and dynamic classes inside the `class` attribute.
4. For CSS variables, keep the project pattern: `property-[var(--token)]`.
5. For layout containers, keep the project tokens: `max-w-[var(--main-container)]` and `max-w-[var(--container)]`.
