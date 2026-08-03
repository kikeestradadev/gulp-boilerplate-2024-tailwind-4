---
name: create-slider-data
description: >-
  Crea y modifica sliders Pug + módulo JS Swiper. Usar al crear, editar o
  refactorizar componentes cuyo nombre termine en -slider.pug o *Slider.js.
---

# Sliders Pug + Swiper

Este boilerplate es un storybook: **no uses `src/pug/data/`**.

Swiper se carga por CDN en `src/pug/config/template.pug` (CSS + JS). No lo añadas como dependencia npm.

## Naming (obligatorio)

| Pieza | Convención | Ejemplo |
|-------|------------|---------|
| Pug | `{name}-slider.pug` | `src/pug/components/allies-slider.pug` |
| Datos inline | `{name}SliderData` | `alliesSliderData` |
| Raíz / bloque | `.{name}-slider` | `.allies-slider` |
| JS | `{name}Slider.js` | `src/js/modules/alliesSlider.js` |
| Const JS | `{name}Slider` | `const alliesSlider` |

## Markup Pug

Declara el contenido al inicio del mismo archivo y recórrelo con `each`. Usa shell de layout (`layout-containers`) y sintaxis larga (`pug-long-syntax`).

```pug
-
	const alliesSliderData = {
		title: 'Aliados',
		items: [
			{ name: 'Aliado 1', image: './assets/aliado.svg', href: '#' }
		]
	}

section(class='allies-slider w-full max-w-[var(--main-container)] mx-auto px-[15px]')
	div(class='w-full max-w-[var(--container)] mx-auto')
		h2(class='text-[length:var(--h2-size)] font-bold mb-6')= alliesSliderData.title
		div(class='swiper')
			div(class='swiper-wrapper')
				each ally in alliesSliderData.items
					article(class='swiper-slide')
						img(src=ally.image alt=ally.name)
			div(class='swiper-pagination')
			div(class='swiper-button-prev')
			div(class='swiper-button-next')
```

## Módulo JS

```js
const alliesSlider = () => {
	if (typeof Swiper === 'undefined') return;

	document.querySelectorAll('.allies-slider').forEach((root) => {
		if (root.dataset.alliesSliderReady === 'true') return;

		const el = root.querySelector('.swiper');
		if (!el) return;

		new Swiper(el, {
			slidesPerView: 1,
			spaceBetween: 16,
			pagination: {
				el: root.querySelector('.swiper-pagination'),
				clickable: true,
			},
			navigation: {
				nextEl: root.querySelector('.swiper-button-next'),
				prevEl: root.querySelector('.swiper-button-prev'),
			},
		});

		root.dataset.alliesSliderReady = 'true';
	});
};

export default alliesSlider;
```

Regístralo en `src/js/index.js` dentro de `initComponents`.

## Reglas

1. No crees `*-data.pug` ni la carpeta `src/pug/data/`.
2. Guarda en el objeto títulos, textos, imágenes, enlaces y demás contenido editable.
3. Mantén controles estructurales de Swiper (`.swiper`, `.swiper-wrapper`, `.swiper-slide`, pagination/nav) en el markup.
4. Conserva la clase raíz `.{name}-slider` que espera el módulo JS.
5. Incluye el Pug desde la página con `include ../components/{name}-slider`.
6. Tipografía y tokens con variables `:root` (`css-root-variables`); layout con `layout-containers`.
