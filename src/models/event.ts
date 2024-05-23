import { JSXOutput, QRL } from '@builder.io/qwik';

export type ToastEventType = 'success' | 'warning' | 'danger' | 'info';

export type ToastEvent = {
	type: ToastEventType;
	icon?: JSXOutput;
	message: string;
	onClose?: QRL;
	autoclose?: boolean;
};
