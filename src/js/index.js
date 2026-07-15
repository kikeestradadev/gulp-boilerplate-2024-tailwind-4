import internalModule from './modules/internalModule';
import storybookTabs from './modules/storybookTabs';
import Prism from 'prismjs';

(() => {
	internalModule();
	storybookTabs(Prism);
	Prism.highlightAll();
})();
