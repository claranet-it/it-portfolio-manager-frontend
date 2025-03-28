import { $, QRL, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';

type FormSkillsType = {
	main_skills?: string;
};

export const useSkills = (skills: string | undefined, onSave: QRL) => {
	const appStore = useContext(AppContext);

	const mode = skills ? 'edit' : 'new';

	const formGroup = useStore({} as FormSkillsType);
	const resetForm = $(() => {
		formGroup.main_skills = undefined;
	});

	const formModalState = useStore<ModalState>({
		title: mode === 'edit' ? t('SKILLS_EDIT') : t('SKILLS_ADD'),
		onCancel$: $(() => {
			resetForm();
		}),
		onConfirm$: $(async () => {
			appStore.isLoading = true;
			await onSave(formGroup);
			appStore.isLoading = false;
			resetForm();
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
		isConfirmDisabled: true,
	});

	const openDialog = $(() => {
		formModalState.isVisible = true;
		formGroup.main_skills = skills || '';
	});

	useTask$(({ track }) => {
		track(() => formGroup.main_skills);
		formModalState.isConfirmDisabled = !formGroup.main_skills;
	});

	return {
		formModalState,
		mode,
		formGroup,
		openDialog,
	};
};
