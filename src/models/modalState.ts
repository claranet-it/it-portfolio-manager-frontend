import { JSXChildren, QRL } from '@builder.io/qwik';

export type ModalState = {
	title?: string;
	message?: string;
	body?: JSXChildren;
	isVisible?: boolean;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm$?: QRL;
	onCancel$?: QRL;
	onClose$?: QRL;
};
