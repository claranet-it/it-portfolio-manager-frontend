import { $, component$, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { t, tt } from 'src/locale/labels';
import { getIcon } from '../icons';
import { Modal } from './Modal';

interface ConfirmTimesModalProp {}

export const ConfirmTimesModal = component$<ConfirmTimesModalProp>(() => {
	const deleteModalState = useStore<ModalState>({
		title: t('CONFIRM_TIMES'),
		message: tt('CONFIRM_TIMES_MESSAGE', { today: 'Data da inviare' }),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	const modalToggle = $(() => {
		deleteModalState.isVisible = true;
	});

	return (
		<>
			<div class='flex w-full flex-row'>
				<button id='open-new-project-bt' onClick$={modalToggle} type='button'>
					<div class='content flex flex-row space-x-1 text-clara-red'>
						<span class='content-center text-xl'>{getIcon('Check')}</span>
						<span class='content-center text-base font-bold'>{t('CONFIRM_TIMES')}</span>
					</div>
				</button>
			</div>
			<Modal state={deleteModalState}></Modal>
		</>
	);
});
