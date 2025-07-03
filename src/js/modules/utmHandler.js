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
	  // Get token from URL
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
			// Solo agregamos el token si no está ya presente
			if (!urlObj.searchParams.has('token')) {
			  urlObj.searchParams.append('token', token);
			  anchor.setAttribute("href", urlObj.toString());
			}
		  } catch (e) {
			// Si el href no es una URL válida, lo ignoramos
		  }
		}
	  });
	});
}

export default utmHandler;
  