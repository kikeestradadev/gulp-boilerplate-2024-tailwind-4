const unbounceCookie = () => {
	document.addEventListener("DOMContentLoaded", function() {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');
		if (token) {
			const buttonIds = [
			"topHeader", "joinNowTopheader", "top1", "top2", "top3", "joinNowMidbanner", "joinNowFourWays", "perk1", "perk2", "perk3", "perk4", "perk5", "rewardPromos",  "contactUs",
			];

			buttonIds.forEach((id) => {
			const element = document.getElementById(id);
			if (element && element.getAttribute("href")) {
				const originalUrl = element.getAttribute("href");
				const newUrl = originalUrl.includes('?') 
				? `${originalUrl}&token=${token}` 
				: `${originalUrl}?token=${token}`;
				element.setAttribute("href", newUrl);
			}
			});       
		} else {
			console.log('No token found in URL');
		}
	});
}

export default unbounceCookie;
