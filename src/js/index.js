import internalModule from './modules/internalModule';
// import deleteUnbounceReset from './unbounceFeatures/deleteUnbounceReset'
// import insertMetaTags from './unbounceFeatures/insertMetaTags'
// import unbounceCookie from './unbounceFeatures/unbounceCookie'


import Prism from 'prismjs';
(() => {
	internalModule();
	// deleteUnbounceReset();
	// insertMetaTags();
	// unbounceCookie();
	Prism.highlightAll(); // Corrected: Use Prism.highlightAll() instead of undefined prismjs()
})();
