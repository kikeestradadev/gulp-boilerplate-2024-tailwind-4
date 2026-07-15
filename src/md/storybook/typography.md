# Tipografía

Escala tipográfica del sistema con variables CSS en `:root`.

## Headlines

Usa las variables `--h1-size` a `--h6-size` con clases Tailwind arbitrarias. Los tamaños cambian automáticamente en el breakpoint de `800px`, igual que `--header-height`.

## Párrafos

Usa `--p-size` y `--p-line` para el cuerpo de texto y listas.

## Ejemplo

```html
<h1 class="text-[length:var(--h1-size)] leading-[length:var(--h1-line)] font-bold">
  Título
</h1>
<p class="text-[length:var(--p-size)] leading-[length:var(--p-line)] text-[var(--paragraph-color)]">
  Párrafo de ejemplo.
</p>
```
