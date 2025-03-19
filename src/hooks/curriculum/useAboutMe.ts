import { $, QRL, useComputed$, useContext, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
type FormAboutMeType = {
	role?: string;
	summary?: string;
};
export const useAboutMe = (role: string | undefined, summary: string | undefined, onSave: QRL) => {
	const appStore = useContext(AppContext);

	const mode = useComputed$(() => {
		return role || summary ? 'edit' : 'new';
	});

	const formGroup = useStore({} as FormAboutMeType);
	const resetForm = $(() => {
		formGroup.role = undefined;
		formGroup.summary = undefined;
	});

	const formModalState = useStore<ModalState>({
		title: mode.value === 'edit' ? t('ABOUT_ME_EDIT') : t('ABOUT_ME_ADD'),
		onCancel$: $(() => {}),
		onConfirm$: $(async () => {
			appStore.isLoading = true;
			await onSave(formGroup);
			appStore.isLoading = false;
			resetForm();
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
	});

	const openDialog = $(() => {
		formModalState.isVisible = true;

		formGroup.role = role;
		formGroup.summary = summary;
	});

	return {
		formModalState,
		mode,
		formGroup,
		openDialog,
	};
};
