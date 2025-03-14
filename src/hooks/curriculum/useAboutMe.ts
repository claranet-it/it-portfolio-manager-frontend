import { $, useComputed$, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { t } from 'src/locale/labels';
type FormAboutMeType = {
	role?: string;
	summary?: string;
};
export const useAboutMe = (role: string | undefined, summary: string | undefined) => {
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
		onConfirm$: $(() => {
			if (mode.value === 'edit') {
				console.log('patch', JSON.stringify(formGroup));
				// Logica di salvataggio per la modifica
			} else {
				console.log('create', JSON.stringify(formGroup));
			}
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
