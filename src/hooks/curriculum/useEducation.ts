import { $, QRL, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { EducationData, Education as EducationType } from '@models/curriculumVitae';
import { ModalState } from '@models/modalState';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
type FormEducationType = {
	startYear?: number;
	endYear?: number;
	institution?: string;
	notes?: string;
	current?: boolean;
};
export const useEducation = (
	work: EducationType[] | undefined,
	onUpdate: QRL,
	onCreate: QRL,
	onDelete: QRL
) => {
	const appStore = useContext(AppContext);

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
				await onCreate(formGroup as EducationData);
			}
			appStore.isLoading = false;
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
