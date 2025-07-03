// Helper functions for cookies
function getCookie(name) {
const value = `; ${document.cookie}`;
const parts = value.split(`; ${name}=`);
if (parts.length === 2) return parts.pop().split(';').shift();
return null;
}

function setCookie(name, value) {
document.cookie = `${name}=${value}; path=/`;
}

const utmHandler = () => {
document.addEventListener("DOMContentLoaded", function() {
	// UTMs definidos manualmente
	const utmSource = "google"; // Cambia este valor según necesites
	const utmMedium = "cpc"; // Cambia este valor según necesites
	const utmCampaign = "brand_campaign"; // Cambia este valor según necesites

	// Get token from URL (dinámico)
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('token');

	if (!token) return; // Si no hay token, no hacemos nada

	// Get all anchor tags in the document
	const anchors = document.getElementsByTagName('a');
	Array.from(anchors).forEach(anchor => {
	if (anchor.getAttribute("href")) {
		try {
		const originalUrl = anchor.getAttribute("href");
		const urlObj = new URL(originalUrl, window.location.origin);
		
		// Agregamos los parámetros en el orden especificado: utm_source, utm_medium, utm_campaign, token
		// Solo agregamos si no están ya presentes
		if (!urlObj.searchParams.has('utm_source')) {
			urlObj.searchParams.append('utm_source', utmSource);
		}
		if (!urlObj.searchParams.has('utm_medium')) {
			urlObj.searchParams.append('utm_medium', utmMedium);
		}
		if (!urlObj.searchParams.has('utm_campaign')) {
			urlObj.searchParams.append('utm_campaign', utmCampaign);
		}
		if (!urlObj.searchParams.has('token')) {
			urlObj.searchParams.append('token', token);
		}
		
		anchor.setAttribute("href", urlObj.toString());
		} catch (e) {
		// Si el href no es una URL válida, lo ignoramos
		}
	}
	});
});
}

export default utmHandler;
