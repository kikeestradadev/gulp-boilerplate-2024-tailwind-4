import {
	createId,
	findTutorName,
	loadCrudStore,
	persistStore,
	readStore,
} from '../db/crudDemoStore';

const BTN_SECONDARY = 'inline-flex items-center justify-center gap-2 border-2 px-4 py-2.5 text-xs font-semibold tracking-wide uppercase no-underline transition-[background-color,border-color,color] duration-200 cursor-pointer border-[var(--btn-secondary)] bg-[var(--btn-secondary)] text-[var(--btn-text)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--btn-secondary-hover)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[var(--btn-secondary-hover)] [@media(hover:hover)_and_(pointer:fine)]:hover:no-underline';
const BTN_OUTLINE = 'inline-flex items-center justify-center gap-2 border-2 px-4 py-2.5 text-xs font-semibold tracking-wide uppercase no-underline transition-[background-color,border-color,color] duration-200 cursor-pointer border-[var(--btn-secondary)] bg-transparent text-[var(--btn-secondary)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--btn-secondary-hover)] [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--btn-secondary-hover)] [@media(hover:hover)_and_(pointer:fine)]:hover:no-underline';

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
	[...form.querySelectorAll('.persona-grid__input, .persona-grid__select, .persona-grid__id')].forEach(
		(input) => {
			const value = persona[input.name];
			input.value = value == null ? '' : String(value);
			input.classList.remove('persona-grid__input--invalid');
		}
	);
};

const populateTutorSelect = (root, tutores, selectedId = '') => {
	const select = root.querySelector('.persona-grid__select[name="tutorId"]');
	if (!select) return;

	const emptyOption = root.dataset.tutorEmptyOption || 'Sin tutor';
	select.innerHTML = '';

	const placeholder = document.createElement('option');
	placeholder.value = '';
	placeholder.textContent = emptyOption;
	select.append(placeholder);

	tutores.forEach((tutor) => {
		const option = document.createElement('option');
		option.value = tutor.id;
		option.textContent = tutor.nombre || tutor.id;
		if (tutor.id === selectedId) {
			option.selected = true;
		}
		select.append(option);
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

const renderGrid = (root, store, labels) => {
	const grid = root.querySelector('.persona-grid__grid');
	const countEl = root.querySelector('.persona-grid__count');
	const preview = root.querySelector('.persona-grid__preview');
	const previewCode = root.querySelector('.persona-grid__preview-code code');
	const emptyMessage = root.dataset.emptyList || 'Sin registros.';
	const tutorCardLabel = root.dataset.tutorCardLabel || 'Tutor';
	const { countLabel, editLabel, deleteLabel, onEdit, onDelete } = labels;
	const { personas, tutores } = store;

	if (!grid) return;

	grid.innerHTML = '';

	if (!personas.length) {
		const empty = document.createElement('p');
		empty.className = 'persona-grid__meta m-0 text-[length:var(--p-size)] leading-[length:var(--p-line)] text-neutral-600';
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
		card.className = 'persona-grid__card flex flex-col border border-neutral-200 bg-white p-4 sm:p-[1.15rem]';
		card.dataset.id = persona.id;

		const body = document.createElement('div');
		body.className = 'persona-grid__card-body mb-4 flex-1';

		const name = document.createElement('h4');
		name.className = 'persona-grid__name m-0 mb-[0.35rem] text-[1.0625rem] font-bold text-[var(--paragraph-color)]';
		name.textContent = persona.nombre || 'Sin nombre';

		const role = document.createElement('p');
		role.className = 'persona-grid__role m-0 mb-3 text-[0.9375rem] text-[var(--link-color)]';
		role.textContent = persona.ocupacion || '';

		const meta = document.createElement('p');
		meta.className = 'persona-grid__meta m-0 text-[0.875rem] leading-[1.45] text-neutral-600';
		meta.textContent = [
			persona.edad != null ? `${persona.edad} años` : null,
			persona.estatura != null ? `${persona.estatura} m` : null,
			persona.ciudad,
			persona.telefono,
			persona.email,
		]
			.filter(Boolean)
			.join(' · ');

		body.append(name, role);

		const tutorName = findTutorName(tutores, persona.tutorId);
		if (tutorName) {
			const tutor = document.createElement('p');
			tutor.className = 'persona-grid__tutor m-0 mb-2 text-[0.875rem] font-semibold text-[var(--paragraph-color)]';
			tutor.textContent = `${tutorCardLabel}: ${tutorName}`;
			body.append(tutor);
		}

		body.append(meta);

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
		previewCode.textContent = JSON.stringify(
			{ personas, tutores },
			null,
			'\t'
		);
		if (typeof Prism !== 'undefined') {
			Prism.highlightElement(previewCode);
		}
	}
};

const personaGrid = () => {
	document.querySelectorAll('.persona-grid').forEach((root) => {
		if (root.dataset.personaGridReady === 'true') return;

		const form = root.querySelector('.persona-grid__form');
		const statusEl = root.querySelector('.persona-grid__status');
		const cancelBtn = root.querySelector('.persona-grid__cancel');
		const personaUrl = root.dataset.url || './data/db/persona.json';
		const tutorUrl = root.dataset.tutorUrl || './data/db/tutor.json';
		const storageKey = root.dataset.storageKey || 'crud-demo-store-v3';
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

		let store = { personas: [], tutores: [] };
		let editingId = null;

		const persist = () => persistStore(storageKey, store);

		const paint = (message, type = 'ok') => {
			renderGrid(root, store, {
				countLabel,
				editLabel,
				deleteLabel,
				onEdit: startEdit,
				onDelete: removePersona,
			});
			setStatus(statusEl, message, type);
		};

		const syncFromStorage = () => {
			const latest = readStore(storageKey);
			if (!latest) return;
			store = latest;
			const currentPersona = editingId
				? store.personas.find((item) => item.id === editingId)
				: null;
			populateTutorSelect(
				root,
				store.tutores,
				currentPersona?.tutorId || form?.elements.namedItem('tutorId')?.value || ''
			);
			paint(null, null);
		};

		const resetCreateMode = () => {
			editingId = null;
			if (form) {
				form.reset();
				const idInput = form.querySelector('.persona-grid__id');
				if (idInput) idInput.value = '';
				[...form.querySelectorAll('.persona-grid__input, .persona-grid__select')].forEach(
					(input) => {
						input.classList.remove('persona-grid__input--invalid');
					}
				);
			}
			populateTutorSelect(root, store.tutores);
			setFormMode(root, 'create');
		};

		const startEdit = (id) => {
			const persona = store.personas.find((item) => item.id === id);
			if (!persona || !form) return;

			editingId = id;
			populateTutorSelect(root, store.tutores, persona.tutorId || '');
			fillForm(form, persona);
			setFormMode(root, 'edit');
			setStatus(statusEl, `Editando: ${persona.nombre || id}`, null);
			form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			const first = form.querySelector('.persona-grid__input');
			if (first) first.focus();
		};

		const removePersona = (id) => {
			const persona = store.personas.find((item) => item.id === id);
			if (!persona) return;
			if (!window.confirm(`${deleteConfirm}\n${persona.nombre || id}`)) return;

			store = {
				...store,
				personas: store.personas.filter((item) => item.id !== id),
			};
			if (!persist()) return;

			if (editingId === id) {
				resetCreateMode();
			}
			paint(deletedMessage, 'ok');
		};

		setStatus(statusEl, loadingMessage, null);
		setFormMode(root, 'create');

		loadCrudStore({
			storageKey,
			personaUrl,
			tutorUrl,
		})
			.then((loaded) => {
				store = loaded;
				populateTutorSelect(root, store.tutores);
				paint(
					loaded.source === 'localStorage'
						? `Cargado desde localStorage (${store.personas.length} ${countLabel})`
						: `Seed desde ${loaded.source} (${store.personas.length} ${countLabel})`,
					store.personas.length ? 'ok' : null
				);
			})
			.catch(() => {
				store = { personas: [], tutores: [] };
				paint(errorMessage, 'error');
			});

		document.addEventListener('crud-demo-store-updated', syncFromStorage);

		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => {
				resetCreateMode();
				setStatus(statusEl, 'Edicion cancelada.', null);
			});
		}

		if (form) {
			form.addEventListener('submit', (event) => {
				event.preventDefault();

				const inputs = [
					...form.querySelectorAll('.persona-grid__input'),
					...form.querySelectorAll('.persona-grid__select'),
				];
				let isValid = true;

				inputs.forEach((input) => {
					if (input.type === 'select-one' && !input.required) return;
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
				if (!payload.tutorId) {
					delete payload.tutorId;
				}

				if (editingId) {
					store = {
						...store,
						personas: store.personas.map((item) =>
							item.id === editingId ? { ...payload, id: editingId } : item
						),
					};
					if (!persist()) return;
					resetCreateMode();
					paint(updatedMessage, 'ok');
					return;
				}

				store = {
					...store,
					personas: [
						...store.personas,
						{ ...payload, id: createId('persona') },
					],
				};
				if (!persist()) return;
				resetCreateMode();
				paint(createdMessage, 'ok');
			});
		}

		root.dataset.personaGridReady = 'true';
	});
};

export default personaGrid;
