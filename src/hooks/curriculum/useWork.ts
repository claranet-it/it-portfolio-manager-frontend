import { $, QRL, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { WorkGetResponse, WorkUpdateData } from '@models/curriculumVitae';
import { ModalState } from '@models/modalState';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';

export const useWork = (
	work: WorkGetResponse[] | undefined,
	onUpdate: QRL,
	onSave: QRL,
	onDelete: QRL
) => {
	const appStore = useContext(AppContext);

	const formGroup = useStore({} as WorkUpdateData);
	const resetForm = $(() => {
		formGroup.year_start = undefined;
		formGroup.year_end = undefined;
		formGroup.role = undefined;
		formGroup.institution = undefined;
		formGroup.note = undefined;
		formGroup.current = undefined;
	});

	const formModalState = useStore<ModalState & { workIdToEdit?: string; mode: 'edit' | 'new' }>({
		title: t('WORK_ADD'),
		onCancel$: $(() => {
			resetForm();
		}),
		onClose$: $(() => {
			resetForm();
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
		mode: 'new',
		workIdToEdit: undefined,
		isConfirmDisabled: true,
	});

	const deleteModalState = useStore<ModalState & { workIdToDelete?: string }>({
		title: t('WORK_DELETE'),
		message: t('WORK_DELETE_MESSAGE'),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
		workIdToDelete: undefined,
	});

	const openEditDialog = $((id: string) => {
		formModalState.workIdToEdit = id;
		formModalState.isVisible = true;
		formModalState.mode = 'edit';
		formModalState.title = t('WORK_EDIT');
		const workElement = work?.find((item) => item.id === id);
		if (workElement) {
			formGroup.year_end = workElement.year_end;
			formGroup.year_start = workElement.year_start;
			formGroup.role = workElement.role;
			formGroup.institution = workElement.institution;
			formGroup.note = workElement.note;
			formGroup.current = workElement.current;
		}
	});

	const openAddDialog = $(() => {
		formModalState.workIdToEdit = undefined;
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

		deleteModalState.onConfirm$ = $(async () => {
			if (deleteModalState.workIdToDelete) {
				appStore.isLoading = true;
				await onDelete(deleteModalState.workIdToDelete);
				appStore.isLoading = false;
				deleteModalState.workIdToDelete = undefined;
			}
		});

		formModalState.onConfirm$ = $(async () => {
			appStore.isLoading = true;
			if (formModalState.mode === 'edit' && formModalState.workIdToEdit) {
				await onUpdate(formModalState.workIdToEdit, formGroup);
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
