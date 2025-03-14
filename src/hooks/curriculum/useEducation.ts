import { $, useStore, useTask$ } from '@builder.io/qwik';
import { Education as EducationType } from '@models/curriculumVitae';
import { ModalState } from '@models/modalState';
import { t } from 'src/locale/labels';
type FormEducationType = {
	startYear?: number;
	endYear?: number;
	institution?: string;
	notes?: string;
	current?: boolean;
};
export const useEducation = (work: EducationType[] | undefined) => {
	const formGroup = useStore({} as FormEducationType);
	const resetForm = $(() => {
		formGroup.startYear = undefined;
		formGroup.endYear = undefined;
		formGroup.institution = undefined;
		formGroup.notes = undefined;
		formGroup.current = undefined;
	});

	const formModalState = useStore<
		ModalState & { educationIdToEdit?: string; mode: 'edit' | 'new' }
	>({
		title: t('EDUCATION_ADD'),
		onCancel$: $(() => {
			resetForm();
			console.log('annulla operazione', JSON.stringify(formGroup));
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
		mode: 'new',
		educationIdToEdit: undefined,
	});

	const deleteModalState = useStore<ModalState & { educationIdToDelete?: string }>({
		title: t('EDUCATION_DELETE'),
		message: t('EDUCATION_DELETE_MESSAGE'),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
		educationIdToDelete: undefined,
	});

	const openEditDialog = $((id: string) => {
		formModalState.educationIdToEdit = undefined;
		console.log('open edit', formModalState.educationIdToEdit, JSON.stringify(formGroup));
		formModalState.educationIdToEdit = id;
		formModalState.isVisible = true;
		formModalState.mode = 'edit';
		formModalState.title = t('EDUCATION_EDIT');
		const workElement = work?.find((item) => item.id === id);
		if (workElement) {
			formGroup.endYear = workElement.year_end;
			formGroup.startYear = workElement.year_start;
			formGroup.institution = workElement.institution;
			formGroup.notes = workElement.note;
			formGroup.current = workElement.current;
		}
	});

	const openAddDialog = $(() => {
		formModalState.educationIdToEdit = undefined;
		console.log('open add', formModalState.educationIdToEdit, JSON.stringify(formGroup));
		formModalState.isVisible = true;
		formModalState.mode = 'new';
		formModalState.title = t('EDUCATION_ADD');
	});

	const openDeleteDialog = $((id: string) => {
		deleteModalState.educationIdToDelete = id;
		deleteModalState.isVisible = true;
	});

	useTask$(() => {
		deleteModalState.onCancel$ = $(() => {
			deleteModalState.educationIdToDelete = undefined;
		});

		deleteModalState.onConfirm$ = $(() => {
			if (deleteModalState.educationIdToDelete) {
				console.log('Delete api with id', deleteModalState.educationIdToDelete);
				deleteModalState.educationIdToDelete = undefined;
			}
		});

		formModalState.onConfirm$ = $(() => {
			if (formModalState.mode === 'edit' && formModalState.educationIdToEdit) {
				console.log(
					'patch id',
					formModalState.educationIdToEdit,
					JSON.stringify(formGroup)
				);
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
