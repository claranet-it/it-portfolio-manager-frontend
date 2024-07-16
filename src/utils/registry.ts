import { $, QRL } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { t } from 'src/locale/labels';

export type RegistryResult = { trackKey: string; modalState: ModalState };

export type RegistryHandler =
	| {
			type: 'customer';
			customer: Customer;
	  }
	| {
			type: 'project';
			customer: Customer;
			project: Project;
	  }
	| {
			type: 'task';
			customer: Customer;
			project: Project;
			task: string;
	  };

export const showAlert = $((data: ModalState, state: ModalState, onConfirm: QRL) => {
	state.isVisible = data.isVisible;
	state.title = data.title;
	state.message = data.message;
	state.confirmLabel = t('ACTION_CONFIRM');
	state.cancelLabel = t('ACTION_CANCEL');
	state.onConfirm$ = $(async () => {
		await onConfirm();
	});
});
