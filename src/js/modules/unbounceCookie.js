const unbounceCookie = () => {
	document.addEventListener("DOMContentLoaded", function() {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');
		
		if (token) {
			// Get all anchor tags in the document
			const anchors = document.getElementsByTagName('a');
			
			// Convert HTMLCollection to Array and iterate
			Array.from(anchors).forEach(anchor => {
				if (anchor.getAttribute("href")) {
					const originalUrl = anchor.getAttribute("href");
					const newUrl = originalUrl.includes('?') 
						? `${originalUrl}&token=${token}` 
						: `${originalUrl}?token=${token}`;
					anchor.setAttribute("href", newUrl);
				}
			});
		} else {
			console.log('No token found in URL');
		}
	});
}

export default unbounceCookie;
