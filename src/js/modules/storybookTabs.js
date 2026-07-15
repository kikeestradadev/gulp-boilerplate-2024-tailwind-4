const storybookTabs = (Prism) => {
	const sections = document.querySelectorAll('[data-storybook]');

	sections.forEach((section) => {
		const tabs = section.querySelectorAll('[data-storybook-tab]');
		const panels = section.querySelectorAll('[data-storybook-panel]');

		const highlightMarkup = () => {
			section.querySelectorAll('[data-storybook-panel="markup"] code').forEach((block) => {
				Prism.highlightElement(block);
			});
		};

		const setActiveTab = (activeTab) => {
			const target = activeTab.dataset.storybookTab;

			tabs.forEach((tab) => {
				const isActive = tab === activeTab;

				tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
				tab.classList.toggle('text-[var(--first-color)]', isActive);
				tab.classList.toggle('border-[var(--first-color)]', isActive);
				tab.classList.toggle('text-gray-500', !isActive);
				tab.classList.toggle('border-transparent', !isActive);
			});

			panels.forEach((panel) => {
				const isActive = panel.dataset.storybookPanel === target;

				panel.classList.toggle('hidden', !isActive);
				panel.classList.toggle('storybook__panel--active', isActive);
			});

			if (target === 'markup') {
				highlightMarkup();
			}
		};

		tabs.forEach((tab) => {
			tab.addEventListener('click', () => setActiveTab(tab));
		});
	});
};

export default storybookTabs;
