import { $, JSXOutput, QRL, component$, useComputed$, useTask$ } from '@builder.io/qwik';
import { ToastEventType } from '@models/event';
import { SELF_TOAST_CLOSING_TIME } from '../utils/constants';
import { UUID } from '../utils/uuid';
import { getIcon } from './icons';

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
			class={`inline-flex w-fit flex-row items-center space-x-2 rounded-md p-4 ${styleToast.value}`}
			role='alert'
		>
			{icon && <span>{icon}</span>}

			<div class='font-base text-sm'>{message}</div>

			<button
				type='button'
				class={`-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg p-1 text-darkgray-900 focus:ring-2 focus:ring-blue-400`}
				onClick$={onClose$ && onClose$}
				data-dismiss-target={`#toast-${ID}`}
				aria-label='Close'
			>
				{getIcon('Close')}
			</button>
		</div>
	);
});
