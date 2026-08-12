import {
	createId,
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
		'tutor-grid__status--ok',
		'tutor-grid__status--error',
		'text-[var(--first-color)]',
		'text-[var(--third-color)]'
	);
	if (type === 'ok') {
		statusEl.classList.add('tutor-grid__status--ok', 'text-[var(--first-color)]');
	} else if (type === 'error') {
		statusEl.classList.add('tutor-grid__status--error', 'text-[var(--third-color)]');
	}
};

const buildTutorFromForm = (form) => {
	const formData = new FormData(form);
	const tutor = {};

	for (const [key, value] of formData.entries()) {
		if (key === 'id') continue;
		tutor[key] = value;
	}

	return tutor;
};

const fillForm = (form, tutor = {}) => {
	[...form.querySelectorAll('.tutor-grid__input, .tutor-grid__id')].forEach((input) => {
		const value = tutor[input.name];
		input.value = value == null ? '' : String(value);
		input.classList.remove('tutor-grid__input--invalid');
	});
};

const setFormMode = (root, mode) => {
	const formTitle = root.querySelector('.tutor-grid__form-title');
	const submitBtn = root.querySelector('.tutor-grid__submit');
	const cancelBtn = root.querySelector('.tutor-grid__cancel');
	const isEdit = mode === 'edit';

	if (formTitle) {
		formTitle.textContent = isEdit
			? root.dataset.formTitleEdit || 'Actualizar tutor'
			: root.dataset.formTitleCreate || 'Crear tutor';
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

const renderGrid = (root, tutores, labels) => {
	const grid = root.querySelector('.tutor-grid__grid');
	const countEl = root.querySelector('.tutor-grid__count');
	const preview = root.querySelector('.tutor-grid__preview');
	const previewCode = root.querySelector('.tutor-grid__preview-code code');
	const emptyMessage = root.dataset.emptyList || 'Sin registros.';
	const { countLabel, editLabel, deleteLabel, onEdit, onDelete } = labels;

	if (!grid) return;

	grid.innerHTML = '';

	if (!tutores.length) {
		const empty = document.createElement('p');
		empty.className = 'tutor-grid__meta m-0 text-[length:var(--p-size)] leading-[length:var(--p-line)] text-neutral-600';
		empty.textContent = emptyMessage;
		grid.append(empty);
		if (countEl) countEl.hidden = true;
		if (preview) preview.hidden = true;
		return;
	}

	if (countEl) {
		countEl.hidden = false;
		countEl.textContent = `${tutores.length} ${countLabel}`;
	}

	tutores.forEach((tutor) => {
		const card = document.createElement('article');
		card.className = 'tutor-grid__card flex flex-col border border-neutral-200 bg-white p-4 sm:p-[1.15rem]';
		card.dataset.id = tutor.id;

		const body = document.createElement('div');
		body.className = 'tutor-grid__card-body mb-4 flex-1';

		const name = document.createElement('h4');
		name.className = 'tutor-grid__name m-0 text-[1.0625rem] font-bold text-[var(--paragraph-color)]';
		name.textContent = tutor.nombre || 'Sin nombre';

		body.append(name);

		const actions = document.createElement('div');
		actions.className = 'tutor-grid__card-actions mt-auto flex flex-wrap gap-2';

		const editBtn = document.createElement('button');
		editBtn.type = 'button';
		editBtn.className = `tutor-grid__edit ${BTN_OUTLINE}`;
		editBtn.textContent = editLabel;
		editBtn.addEventListener('click', () => onEdit(tutor.id));

		const deleteBtn = document.createElement('button');
		deleteBtn.type = 'button';
		deleteBtn.className = `tutor-grid__delete ${BTN_SECONDARY}`;
		deleteBtn.textContent = deleteLabel;
		deleteBtn.addEventListener('click', () => onDelete(tutor.id));

		actions.append(editBtn, deleteBtn);
		card.append(body, actions);
		grid.append(card);
	});

	if (preview && previewCode) {
		preview.hidden = false;
		previewCode.textContent = JSON.stringify({ tutores }, null, '\t');
		if (typeof Prism !== 'undefined') {
			Prism.highlightElement(previewCode);
		}
	}
};

const tutorGrid = () => {
	document.querySelectorAll('.tutor-grid').forEach((root) => {
		if (root.dataset.tutorGridReady === 'true') return;

		const form = root.querySelector('.tutor-grid__form');
		const statusEl = root.querySelector('.tutor-grid__status');
		const cancelBtn = root.querySelector('.tutor-grid__cancel');
		const tutorUrl = root.dataset.url || './data/db/tutor.json';
		const personaUrl = root.dataset.personaUrl || './data/db/persona.json';
		const storageKey = root.dataset.storageKey || 'crud-demo-store-v3';
		const errorMessage =
			root.dataset.errorMessage || 'No se pudo cargar el JSON estático.';
		const loadingMessage = root.dataset.loadingMessage || 'Cargando…';
		const createdMessage = root.dataset.createdMessage || 'Tutor creado.';
		const updatedMessage = root.dataset.updatedMessage || 'Tutor actualizado.';
		const deletedMessage = root.dataset.deletedMessage || 'Tutor eliminado.';
		const deleteBlockedMessage =
			root.dataset.deleteBlockedMessage ||
			'No se puede eliminar: hay personas con este tutor asignado.';
		const countLabel = root.dataset.countLabel || 'registros';
		const editLabel = root.dataset.editLabel || 'Editar';
		const deleteLabel = root.dataset.deleteLabel || 'Eliminar';
		const deleteConfirm = root.dataset.deleteConfirm || '¿Eliminar este tutor?';

		let store = { personas: [], tutores: [] };
		let editingId = null;

		const persist = () => persistStore(storageKey, store);

		const paint = (message, type = 'ok') => {
			renderGrid(root, store.tutores, {
				countLabel,
				editLabel,
				deleteLabel,
				onEdit: startEdit,
				onDelete: removeTutor,
			});
			setStatus(statusEl, message, type);
		};

		const syncFromStorage = () => {
			const latest = readStore(storageKey);
			if (!latest) return;
			store = latest;
			paint(null, null);
		};

		const resetCreateMode = () => {
			editingId = null;
			if (form) {
				form.reset();
				const idInput = form.querySelector('.tutor-grid__id');
				if (idInput) idInput.value = '';
				[...form.querySelectorAll('.tutor-grid__input')].forEach((input) => {
					input.classList.remove('tutor-grid__input--invalid');
				});
			}
			setFormMode(root, 'create');
		};

		const startEdit = (id) => {
			const tutor = store.tutores.find((item) => item.id === id);
			if (!tutor || !form) return;

			editingId = id;
			fillForm(form, tutor);
			setFormMode(root, 'edit');
			setStatus(statusEl, `Editando: ${tutor.nombre || id}`, null);
			form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			const first = form.querySelector('.tutor-grid__input');
			if (first) first.focus();
		};

		const removeTutor = (id) => {
			const tutor = store.tutores.find((item) => item.id === id);
			if (!tutor) return;

			const assigned = store.personas.filter((persona) => persona.tutorId === id);
			if (assigned.length) {
				setStatus(statusEl, deleteBlockedMessage, 'error');
				return;
			}

			if (!window.confirm(`${deleteConfirm}\n${tutor.nombre || id}`)) return;

			store = {
				...store,
				tutores: store.tutores.filter((item) => item.id !== id),
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
				paint(
					loaded.source === 'localStorage'
						? `Cargado desde localStorage (${store.tutores.length} ${countLabel})`
						: `Seed desde ${loaded.source} (${store.tutores.length} ${countLabel})`,
					store.tutores.length ? 'ok' : null
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

				const inputs = [...form.querySelectorAll('.tutor-grid__input')];
				let isValid = true;

				inputs.forEach((input) => {
					const ok = input.checkValidity();
					input.classList.toggle('tutor-grid__input--invalid', !ok);
					input.classList.toggle('border-[var(--third-color)]', !ok);
					if (!ok) isValid = false;
				});

				if (!isValid) {
					form.reportValidity();
					return;
				}

				const payload = buildTutorFromForm(form);

				if (editingId) {
					store = {
						...store,
						tutores: store.tutores.map((item) =>
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
					tutores: [...store.tutores, { ...payload, id: createId('tutor') }],
				};
				if (!persist()) return;
				resetCreateMode();
				paint(createdMessage, 'ok');
			});
		}

		root.dataset.tutorGridReady = 'true';
	});
};

export default tutorGrid;
