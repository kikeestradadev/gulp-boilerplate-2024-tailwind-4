const utmSources = () => {
	function () {
		if ({{q_utm_source}}) {
			//utm_source found in URL. Set in cookie and update
			//this variable
			window.document.cookie = "utm_source={{q_utm_source}}; ; path=/";
			return {{q_utm_source}};
		} else {
			//No utm_source found in URL. Load from cookie
			return {{c_utm_source}};
		}
		}
}

export default utmSources;
