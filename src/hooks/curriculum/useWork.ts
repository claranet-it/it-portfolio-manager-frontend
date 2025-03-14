import { $, useStore, useTask$ } from '@builder.io/qwik';
import { Work as WorkType } from '@models/curriculumVitae';
import { ModalState } from '@models/modalState';
import { t } from 'src/locale/labels';
type FormWorkType = {
	startYear?: number;
	endYear?: number;
	role?: string;
	company?: string;
	notes?: string;
	current?: boolean;
};
export const useWork = (work: WorkType[] | undefined) => {
	const formGroup = useStore({} as FormWorkType);
	const resetForm = $(() => {
		formGroup.startYear = undefined;
		formGroup.endYear = undefined;
		formGroup.role = undefined;
		formGroup.company = undefined;
		formGroup.notes = undefined;
		formGroup.current = undefined;
	});

	const formModalState = useStore<ModalState & { workIdToEdit?: string; mode: 'edit' | 'new' }>({
		title: t('WORK_ADD'),
		onCancel$: $(() => {
			resetForm();
			console.log('annulla operazione', JSON.stringify(formGroup));
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
		mode: 'new',
		workIdToEdit: undefined,
	});

	const deleteModalState = useStore<ModalState & { workIdToDelete?: string }>({
		title: t('WORK_DELETE'),
		message: t('WORK_DELETE_MESSAGE'),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
		workIdToDelete: undefined,
	});

	const openEditDialog = $((id: string) => {
		formModalState.workIdToEdit = undefined;
		console.log('open edit', formModalState.workIdToEdit, JSON.stringify(formGroup));
		formModalState.workIdToEdit = id;
		formModalState.isVisible = true;
		formModalState.mode = 'edit';
		formModalState.title = t('WORK_EDIT');
		const workElement = work?.find((item) => item.id === id);
		if (workElement) {
			formGroup.endYear = workElement.year_end;
			formGroup.startYear = workElement.year_start;
			formGroup.role = workElement.role;
			formGroup.company = workElement.institution;
			formGroup.notes = workElement.note;
			formGroup.current = workElement.current;
		}
	});

	const openAddDialog = $(() => {
		formModalState.workIdToEdit = undefined;
		console.log('open add', formModalState.workIdToEdit, JSON.stringify(formGroup));
		formModalState.isVisible = true;
		formModalState.mode = 'new';
		formModalState.title = t('WORK_ADD');
	});

	const openDeleteDialog = $((id: string) => {
		deleteModalState.workIdToDelete = id;
		deleteModalState.isVisible = true;
	});

	useTask$(() => {
		deleteModalState.onCancel$ = $(() => {
			deleteModalState.workIdToDelete = undefined;
		});

		deleteModalState.onConfirm$ = $(() => {
			if (deleteModalState.workIdToDelete) {
				console.log('Delete api with id', deleteModalState.workIdToDelete);
				deleteModalState.workIdToDelete = undefined;
			}
		});

		formModalState.onConfirm$ = $(() => {
			if (formModalState.mode === 'edit' && formModalState.workIdToEdit) {
				console.log('patch id', formModalState.workIdToEdit, JSON.stringify(formGroup));
				// Logica di salvataggio per la modifica
			} else {
				console.log('create id', JSON.stringify(formGroup));
			}
			resetForm();
		});
	});

	return {
		formGroup,
		formModalState,
		deleteModalState,
		openDeleteDialog,
		openAddDialog,
		openEditDialog,
	};
};
