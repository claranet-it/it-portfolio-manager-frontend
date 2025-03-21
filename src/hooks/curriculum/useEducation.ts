import { $, QRL, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { EducationGetResponse, EducationUpdateData } from '@models/curriculumVitae';
import { ModalState } from '@models/modalState';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';

export const useEducation = (
	education: EducationGetResponse[] | undefined,
	onUpdate: QRL,
	onSave: QRL,
	onDelete: QRL
) => {
	const appStore = useContext(AppContext);

	const formGroup = useStore({} as EducationUpdateData);
	const resetForm = $(() => {
		formGroup.year_start = undefined;
		formGroup.year_end = undefined;
		formGroup.institution = undefined;
		formGroup.note = undefined;
		formGroup.current = undefined;
	});

	const formModalState = useStore<
		ModalState & { educationIdToEdit?: string; mode: 'edit' | 'new' }
	>({
		title: t('EDUCATION_ADD'),
		onCancel$: $(() => {
			resetForm();
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
		mode: 'new',
		educationIdToEdit: undefined,
		isConfirmDisabled: true,
	});

	const deleteModalState = useStore<ModalState & { educationIdToDelete?: string }>({
		title: t('EDUCATION_DELETE'),
		message: t('EDUCATION_DELETE_MESSAGE'),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
		educationIdToDelete: undefined,
	});

	const openEditDialog = $((id: string) => {
		formModalState.educationIdToEdit = id;
		formModalState.isVisible = true;
		formModalState.mode = 'edit';
		formModalState.title = t('EDUCATION_EDIT');
		const educationElement = education?.find((item) => item.id === id);
		if (educationElement) {
			formGroup.year_end = educationElement.year_end;
			formGroup.year_start = educationElement.year_start;
			formGroup.institution = educationElement.institution;
			formGroup.note = educationElement.note;
			formGroup.current = educationElement.current;
		}
	});

	const openAddDialog = $(() => {
		formModalState.educationIdToEdit = undefined;
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

		deleteModalState.onConfirm$ = $(async () => {
			if (deleteModalState.educationIdToDelete) {
				appStore.isLoading = true;
				await onDelete(deleteModalState.educationIdToDelete);
				appStore.isLoading = false;
				deleteModalState.educationIdToDelete = undefined;
			}
		});

		formModalState.onConfirm$ = $(async () => {
			appStore.isLoading = true;
			if (formModalState.mode === 'edit' && formModalState.educationIdToEdit) {
				await onUpdate(formModalState.educationIdToEdit, formGroup);
			} else {
				await onSave(formGroup);
			}
			appStore.isLoading = false;
			resetForm();
		});
	});

	useTask$(({ track }) => {
		track(() => formGroup.year_start);
		track(() => formGroup.institution);

		formModalState.isConfirmDisabled = !formGroup.year_start || !formGroup.institution;
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
