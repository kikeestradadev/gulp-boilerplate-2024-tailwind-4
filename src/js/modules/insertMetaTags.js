const insertMetaTags = () => {
	const metaTags = [
		{ tag: 'meta', attrs: { charset: 'utf-8' } },
		{ tag: 'meta', attrs: { name: 'viewport', content: 'width=device-width,initial-scale=1' } },
		{ tag: 'meta', attrs: { name: 'format-detection', content: 'telephone=no' } },
		{ tag: 'meta', attrs: { name: 'theme-color', content: '#0096D9' } },
		{ tag: 'link', attrs: { rel: 'shortcut icon', type: 'image/png', href: './assets/img/icon_1024.png' } },
		{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: './assets/img/icon_1024.png' } },
		{ tag: 'meta', attrs: { name: 'description', content: 'Breve descripción del sitio web que ayuda en el SEO.' } },
		{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: 'upgrade-insecure-requests' } },
		{ tag: 'meta', attrs: { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' } },
		{ tag: 'meta', attrs: { 'http-equiv': 'Expires', content: '0' } },
		{ tag: 'meta', attrs: { 'http-equiv': 'Pragma', content: 'no-cache' } },
		];

		metaTags.forEach(({ tag, attrs }) => {
			const element = document.createElement(tag);
				Object.entries(attrs).forEach(([key, value]) => {
				element.setAttribute(key, value);
			});
			document.head.appendChild(element);
		});
}

export default insertMetaTags;
