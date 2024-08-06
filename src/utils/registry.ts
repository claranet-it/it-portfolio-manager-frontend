import { $, QRL } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { t, tt } from 'src/locale/labels';

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

const modalBuilder = (
	type: 'EDIT' | 'EDIT_CUSTOMER' | 'DELETE',
	props: RegistryHandler
): ModalState => {
	if (type === 'EDIT') {
		return {
			isVisible: true,
			title: tt('REGISTRY_EDIT_TITLE', { type: props.type }),
		};
	} else if (type === 'EDIT_CUSTOMER') {
		return {
			isVisible: true,
			title: tt('REGISTRY_EDIT_TITLE', { type: props.type }),
		};
	}

	return {
		isVisible: true,
		title: t('REGISTRY_DELETE_TITLE'),
		message: tt('REGISTRY_DELETE_MESSAGE', {
			type: props.type,
			value:
				props.type == 'customer'
					? props.customer
					: props.type == 'project'
						? props.project.name
						: props.task,
		}),
	};
};

export const showAlert = $(
	(
		type: 'EDIT' | 'EDIT_CUSTOMER' | 'DELETE',
		props: RegistryHandler,
		state: ModalState,
		onConfirm: QRL
	) => {
		const data = modalBuilder(type, props);

		state.isVisible = data.isVisible;
		state.title = data.title;
		state.message = data.message;
		state.confirmLabel = t('ACTION_CONFIRM');
		state.cancelLabel = t('ACTION_CANCEL');
		state.onConfirm$ = $(async () => {
			await onConfirm();
		});
	}
);

export const capitalizeFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};
