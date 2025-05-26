import component from './components/component';
import deleteUnbounceReset from './unbounce/deleteUnbounceReset';
import insertMetaTags from './unbounce/insertMetaTags';
import utmHandler from './unbounce/utmHandler';
import Prism from 'prismjs';

(() => {
	component();
	deleteUnbounceReset();
	insertMetaTags();
	utmHandler();
	Prism.highlightAll(); // Corrected: Use Prism.highlightAll() instead of undefined prismjs()
})();
