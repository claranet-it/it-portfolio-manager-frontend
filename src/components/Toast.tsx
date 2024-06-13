import { $, JSXOutput, QRL, component$, useComputed$, useTask$ } from '@builder.io/qwik';
import { getIcon } from './icons';
import { UUID } from '../utils/uuid';
import { ToastEventType } from '@models/event';
import { SELF_TOAST_CLOSING_TIME } from '../utils/constants';

interface ToastProps {
	icon?: JSXOutput;
	message: string;
	onClose$?: QRL;
	autoclose?: boolean;
	type: ToastEventType;
}

export const Toast = component$<ToastProps>(({ icon, message, onClose$, autoclose, type }) => {
	const ID = UUID();

	const closeToast = $(() => {
		const closeButton = document.getElementById(`toast-${ID}`);
		closeButton?.click();
		onClose$ && onClose$();
	});

	autoclose &&
		useTask$(() => {
			setTimeout(closeToast, SELF_TOAST_CLOSING_TIME);
		});

	const styleToast = useComputed$(() => {
		switch (type) {
			case 'success':
				return 'bg-success-light text-success-dark';
			case 'warning':
				return 'bg-warning-light text-dark-grey';
			case 'danger':
				return 'bg-danger-light text-danger-dark';
			default: // 'info'
				return 'bg-info-light text-info-dark';
		}
	});

	return (
		<div
			id={`toast-${ID}`}
			class={`w-fit inline-flex flex-row space-x-2 items-center p-4 rounded-md ${styleToast.value}`}
			role='alert'
		>
			{icon && <span>{icon}</span>}

			<div class='text-sm font-base'>{message}</div>

			<button
				type='button'
				class={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-blue-400 p-1  inline-flex items-center justify-center h-8 w-8 text-darkgray-900`}
				onClick$={onClose$ && onClose$}
				data-dismiss-target={`#toast-${ID}`}
				aria-label='Close'
			>
				{getIcon('Close')}
			</button>
		</div>
	);
});
