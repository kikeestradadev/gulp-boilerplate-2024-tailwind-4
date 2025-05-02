import internalModule from './modules/internalModule';
import Prism from 'prismjs';
(() => {
	internalModule();
	Prism.highlightAll(); // Corrected: Use Prism.highlightAll() instead of undefined prismjs()
})();
