import { $, useComputed$, useSignal, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { t } from 'src/locale/labels';

export const useSkills = (skills: string | undefined) => {
	const mode = useComputed$(() => {
		return skills ? 'edit' : 'new';
	});

	const skillSignal = useSignal<string>(skills || '');

	const formModalState = useStore<ModalState>({
		title: mode.value === 'edit' ? t('SKILLS_EDIT') : t('SKILLS_ADD'),
		onCancel$: $(() => {}),
		onConfirm$: $(() => {
			if (mode.value === 'edit') {
				console.log('patch', JSON.stringify(skillSignal));
				// Logica di salvataggio per la modifica
			} else {
				console.log('create', JSON.stringify(skillSignal));
			}
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
	});

	const openDialog = $(() => {
		formModalState.isVisible = true;
		skillSignal.value = skills || '';
	});

	return {
		formModalState,
		mode,
		skillSignal,
		openDialog,
	};
};
