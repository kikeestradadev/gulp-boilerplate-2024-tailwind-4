const utmMedium = () => {
	function () {
		if ({{q_utm_medium}}) {
		  // utm_medium found in URL. Set in cookie and update
		  window.document.cookie = "utm_medium={{q_utm_medium}}; path=/";
		  return {{q_utm_medium}};
		} else {
		  // No utm_medium found in URL. Load from cookie
		  return {{c_utm_medium}};
		}
	  }
}

export default utmMedium;
