const STORAGE_FALLBACK_KEY = 'persona-grid-store-v2';

const BTN_BASE =
	'inline-flex items-center justify-center gap-2 border-2 px-4 py-2.5 text-xs font-semibold tracking-wide uppercase no-underline transition-[background-color,border-color,color] duration-200 cursor-pointer';
const BTN_PRIMARY = `${BTN_BASE} border-[var(--btn-primary)] bg-[var(--btn-primary)] text-[var(--btn-text)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--btn-primary-hover)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--btn-primary-hover)] [@media(hover:hover)_and_(pointer:fine)]:hover:no-underline`;
const BTN_SECONDARY = `${BTN_BASE} border-[var(--btn-secondary)] bg-[var(--btn-secondary)] text-[var(--btn-text)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--btn-secondary-hover)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--btn-secondary-hover)] [@media(hover:hover)_and_(pointer:fine)]:hover:no-underline`;
const BTN_OUTLINE = `${BTN_BASE} border-[var(--btn-secondary)] bg-transparent text-[var(--btn-secondary)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--btn-secondary-hover)] [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--btn-secondary-hover)] [@media(hover:hover)_and_(pointer:fine)]:hover:no-underline`;

const createId = () => {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	return `persona-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const setStatus = (statusEl, message, type) => {
	if (!statusEl) return;
	statusEl.hidden = !message;
	statusEl.textContent = message || '';
	statusEl.classList.remove(
		'persona-grid__status--ok',
		'persona-grid__status--error',
		'text-[var(--first-color)]',
		'text-[var(--third-color)]'
	);
	if (type === 'ok') {
		statusEl.classList.add('persona-grid__status--ok', 'text-[var(--first-color)]');
	} else if (type === 'error') {
		statusEl.classList.add('persona-grid__status--error', 'text-[var(--third-color)]');
	}
};

const readStore = (storageKey) => {
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed?.personas) ? parsed.personas : null;
	} catch {
		return null;
	}
};

const writeStore = (storageKey, personas) => {
	try {
		localStorage.setItem(storageKey, JSON.stringify({ personas }));
		return true;
	} catch {
		return false;
	}
};

const ensureIds = (list) =>
	list.map((persona) =>
		persona?.id
			? persona
			: {
					...persona,
					id: createId(),
				}
	);

const buildPersonaFromForm = (form) => {
	const formData = new FormData(form);
	const persona = {};

	for (const [key, value] of formData.entries()) {
		if (key === 'id') continue;
		const input = form.elements.namedItem(key);
		if (input && input.type === 'number' && value !== '') {
			persona[key] = Number(value);
			continue;
		}
		persona[key] = value;
	}

	return persona;
};

const fillForm = (form, persona = {}) => {
	[...form.querySelectorAll('.persona-grid__input, .persona-grid__id')].forEach((input) => {
		const value = persona[input.name];
		input.value = value == null ? '' : String(value);
		input.classList.remove('persona-grid__input--invalid', 'border-[var(--third-color)]');
	});
};

const setFormMode = (root, mode) => {
	const formTitle = root.querySelector('.persona-grid__form-title');
	const submitBtn = root.querySelector('.persona-grid__submit');
	const cancelBtn = root.querySelector('.persona-grid__cancel');
	const isEdit = mode === 'edit';

	if (formTitle) {
		formTitle.textContent = isEdit
			? root.dataset.formTitleEdit || 'Actualizar persona'
			: root.dataset.formTitleCreate || 'Crear persona';
	}
	if (submitBtn) {
		submitBtn.textContent = isEdit
			? root.dataset.submitUpdate || 'Actualizar'
			: root.dataset.submitCreate || 'Crear';
	}
	if (cancelBtn) {
		cancelBtn.hidden = !isEdit;
	}
};

const renderGrid = (root, personas, labels) => {
	const grid = root.querySelector('.persona-grid__grid');
	const countEl = root.querySelector('.persona-grid__count');
	const preview = root.querySelector('.persona-grid__preview');
	const previewCode = root.querySelector('.persona-grid__preview-code code');
	const emptyMessage = root.dataset.emptyList || 'Sin registros.';
	const { countLabel, editLabel, deleteLabel, onEdit, onDelete } = labels;

	if (!grid) return;

	grid.innerHTML = '';

	if (!personas.length) {
		const empty = document.createElement('p');
		empty.className =
			'persona-grid__meta m-0 text-[length:var(--p-size)] leading-[length:var(--p-line)] text-neutral-600';
		empty.textContent = emptyMessage;
		grid.append(empty);
		if (countEl) countEl.hidden = true;
		if (preview) preview.hidden = true;
		return;
	}

	if (countEl) {
		countEl.hidden = false;
		countEl.textContent = `${personas.length} ${countLabel}`;
	}

	personas.forEach((persona) => {
		const card = document.createElement('article');
		card.className =
			'persona-grid__card flex flex-col border border-neutral-200 bg-white p-4 sm:p-[1.15rem]';
		card.dataset.id = persona.id;

		const body = document.createElement('div');
		body.className = 'persona-grid__card-body mb-4 flex-1';

		const name = document.createElement('h4');
		name.className =
			'persona-grid__name m-0 mb-[0.35rem] text-[1.0625rem] font-bold text-[var(--paragraph-color)]';
		name.textContent = persona.nombre || 'Sin nombre';

		const role = document.createElement('p');
		role.className =
			'persona-grid__role m-0 mb-3 text-[0.9375rem] text-[var(--link-color)]';
		role.textContent = persona.ocupacion || '';

		const meta = document.createElement('p');
		meta.className =
			'persona-grid__meta m-0 text-[0.875rem] leading-[1.45] text-neutral-600';
		meta.textContent = [
			persona.edad != null ? `${persona.edad} años` : null,
			persona.estatura != null ? `${persona.estatura} m` : null,
			persona.ciudad,
			persona.telefono,
			persona.email,
		]
			.filter(Boolean)
			.join(' · ');

		body.append(name, role, meta);

		const actions = document.createElement('div');
		actions.className = 'persona-grid__card-actions mt-auto flex flex-wrap gap-2';

		const editBtn = document.createElement('button');
		editBtn.type = 'button';
		editBtn.className = `persona-grid__edit ${BTN_OUTLINE}`;
		editBtn.textContent = editLabel;
		editBtn.addEventListener('click', () => onEdit(persona.id));

		const deleteBtn = document.createElement('button');
		deleteBtn.type = 'button';
		deleteBtn.className = `persona-grid__delete ${BTN_SECONDARY}`;
		deleteBtn.textContent = deleteLabel;
		deleteBtn.addEventListener('click', () => onDelete(persona.id));

		actions.append(editBtn, deleteBtn);
		card.append(body, actions);
		grid.append(card);
	});

	if (preview && previewCode) {
		preview.hidden = false;
		previewCode.textContent = JSON.stringify({ personas }, null, '\t');
		if (typeof Prism !== 'undefined') {
			Prism.highlightElement(previewCode);
		}
	}
};

const loadPersonas = async (dataUrl, storageKey) => {
	const stored = readStore(storageKey);
	if (stored) {
		const personas = ensureIds(stored);
		writeStore(storageKey, personas);
		return { personas, source: 'localStorage' };
	}

	const response = await fetch(dataUrl);
	if (!response.ok) {
		throw new Error(`GET ${dataUrl} failed`);
	}

	const data = await response.json();
	const personas = ensureIds(Array.isArray(data.personas) ? data.personas : []);
	writeStore(storageKey, personas);
	return { personas, source: dataUrl };
};

const personaGrid = () => {
	document.querySelectorAll('.persona-grid').forEach((root) => {
		if (root.dataset.personaGridReady === 'true') return;

		const form = root.querySelector('.persona-grid__form');
		const statusEl = root.querySelector('.persona-grid__status');
		const cancelBtn = root.querySelector('.persona-grid__cancel');
		const dataUrl = root.dataset.url || './data/persona.json';
		const storageKey = root.dataset.storageKey || STORAGE_FALLBACK_KEY;
		const errorMessage =
			root.dataset.errorMessage || 'No se pudo cargar el JSON estático.';
		const loadingMessage = root.dataset.loadingMessage || 'Cargando…';
		const createdMessage = root.dataset.createdMessage || 'Persona creada.';
		const updatedMessage = root.dataset.updatedMessage || 'Persona actualizada.';
		const deletedMessage = root.dataset.deletedMessage || 'Persona eliminada.';
		const countLabel = root.dataset.countLabel || 'registros';
		const editLabel = root.dataset.editLabel || 'Editar';
		const deleteLabel = root.dataset.deleteLabel || 'Eliminar';
		const deleteConfirm =
			root.dataset.deleteConfirm || '¿Eliminar esta persona?';

		let personas = [];
		let editingId = null;

		const persist = () => {
			if (!writeStore(storageKey, personas)) {
				setStatus(
					statusEl,
					'No se pudo guardar en localStorage (¿modo privado o almacenamiento lleno?).',
					'error'
				);
				return false;
			}
			return true;
		};

		const paint = (message, type = 'ok') => {
			renderGrid(root, personas, {
				countLabel,
				editLabel,
				deleteLabel,
				onEdit: startEdit,
				onDelete: removePersona,
			});
			setStatus(statusEl, message, type);
		};

		const resetCreateMode = () => {
			editingId = null;
			if (form) {
				form.reset();
				const idInput = form.querySelector('.persona-grid__id');
				if (idInput) idInput.value = '';
				[...form.querySelectorAll('.persona-grid__input')].forEach((input) => {
					input.classList.remove(
						'persona-grid__input--invalid',
						'border-[var(--third-color)]'
					);
				});
			}
			setFormMode(root, 'create');
		};

		const startEdit = (id) => {
			const persona = personas.find((item) => item.id === id);
			if (!persona || !form) return;

			editingId = id;
			fillForm(form, persona);
			setFormMode(root, 'edit');
			setStatus(statusEl, `Editando: ${persona.nombre || id}`, null);
			form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			const first = form.querySelector('.persona-grid__input');
			if (first) first.focus();
		};

		const removePersona = (id) => {
			const persona = personas.find((item) => item.id === id);
			if (!persona) return;
			if (!window.confirm(`${deleteConfirm}\n${persona.nombre || id}`)) return;

			personas = personas.filter((item) => item.id !== id);
			if (!persist()) return;

			if (editingId === id) {
				resetCreateMode();
			}
			paint(deletedMessage, 'ok');
		};

		setStatus(statusEl, loadingMessage, null);
		setFormMode(root, 'create');

		loadPersonas(dataUrl, storageKey)
			.then(({ personas: loaded, source }) => {
				personas = loaded;
				paint(
					source === 'localStorage'
						? `Cargado desde localStorage (${personas.length} ${countLabel})`
						: `Seed desde ${source} (${personas.length} ${countLabel})`,
					personas.length ? 'ok' : null
				);
			})
			.catch(() => {
				personas = [];
				paint(errorMessage, 'error');
			});

		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => {
				resetCreateMode();
				setStatus(statusEl, 'Edicion cancelada.', null);
			});
		}

		if (form) {
			form.addEventListener('submit', (event) => {
				event.preventDefault();

				const inputs = [...form.querySelectorAll('.persona-grid__input')];
				let isValid = true;

				inputs.forEach((input) => {
					const ok = input.checkValidity();
					input.classList.toggle('persona-grid__input--invalid', !ok);
					input.classList.toggle('border-[var(--third-color)]', !ok);
					if (!ok) isValid = false;
				});

				if (!isValid) {
					form.reportValidity();
					return;
				}

				const payload = buildPersonaFromForm(form);

				if (editingId) {
					personas = personas.map((item) =>
						item.id === editingId ? { ...payload, id: editingId } : item
					);
					if (!persist()) return;
					resetCreateMode();
					paint(updatedMessage, 'ok');
					return;
				}

				personas = [...personas, { ...payload, id: createId() }];
				if (!persist()) return;
				resetCreateMode();
				paint(createdMessage, 'ok');
			});
		}

		root.dataset.personaGridReady = 'true';
	});
};

export default personaGrid;
