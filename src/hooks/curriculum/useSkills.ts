import { $, QRL, useComputed$, useContext, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';

type FormSkillsType = {
	main_skills?: string;
};

export const useSkills = (skills: string | undefined, onUpdate: QRL, onCreate: QRL) => {
	const appStore = useContext(AppContext);

	const mode = useComputed$(() => {
		return skills ? 'edit' : 'new';
	});

	const formGroup = useStore({} as FormSkillsType);
	const resetForm = $(() => {
		formGroup.main_skills = undefined;
	});

	const formModalState = useStore<ModalState>({
		title: mode.value === 'edit' ? t('SKILLS_EDIT') : t('SKILLS_ADD'),
		onCancel$: $(() => {
			resetForm();
		}),
		onConfirm$: $(async () => {
			appStore.isLoading = true;
			if (mode.value === 'edit') {
				await onUpdate(formGroup);
			} else {
				await onCreate(formGroup);
			}
			appStore.isLoading = false;
			resetForm();
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
	});

	const openDialog = $(() => {
		formModalState.isVisible = true;
		formGroup.main_skills = skills || '';
	});

	return {
		formModalState,
		mode,
		formGroup,
		openDialog,
	};
};
