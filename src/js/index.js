import internalModule from './modules/internalModule';
import homeChooseSlider from './modules/homeChooseSlider'; 
import homeTrustedSlider from './modules/homeTrustedSlider';
import deleteUnbounceReset from './modules/deleteUnbounceReset';
import insertMetaTags from './modules/insertMetaTags';
import unbounceCookie from './modules/unbounceCookie';
import utmHandler from './modules/utmHandler';

// import Prism from 'prismjs';
(() => {
	internalModule();
	// Prism.highlightAll(); // Corrected: Use Prism.highlightAll() instead of undefined prismjs()
	homeChooseSlider(); 
	homeTrustedSlider();
	deleteUnbounceReset();
	insertMetaTags();
	unbounceCookie();
	utmHandler();
})();
