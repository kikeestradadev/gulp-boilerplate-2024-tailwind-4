const deleteUnbounceReset = () => {
	const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
	stylesheets.forEach(link => {
		if (link instanceof HTMLLinkElement && link.href.includes('published-css/main-ebbfc5e.z.css')) {
			link.parentNode?.removeChild(link);
		}
	});
}

export default deleteUnbounceReset;
