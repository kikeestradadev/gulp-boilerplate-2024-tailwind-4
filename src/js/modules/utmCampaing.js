const utmCampaing = () => {
	function () {
		if ({{q_utm_campaign}}) {
		  // utm_campaign found in URL. Set in cookie and update
		  window.document.cookie = "utm_campaign={{q_utm_campaign}}; path=/";
		  return {{q_utm_campaign}};
		} else {
		  // No utm_campaign found in URL. Load from cookie
		  return {{c_utm_campaign}};
		}
	  }
}

export default utmCampaing;
