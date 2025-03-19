import { $, Slot, component$, useComputed$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { Button } from '../Button';
import { getIcon } from '../icons';

interface ModalProps {
	state: ModalState;
}

export const Modal = component$<ModalProps>(({ state }) => {
	const onConfirm = $(() => {
		state.isVisible = false;
		state.onConfirm$ && state.onConfirm$();
	});

	const onCancel = $(() => {
		state.isVisible = false;
		state.onCancel$ && state.onCancel$();
	});

	const onClose = $(() => {
		state.isVisible = false;
		state.body = undefined;
		state.onClose$ && state.onClose$();
	});

	const isVisible = useComputed$(() => {
		return state.isVisible ? 'fixed' : 'hidden';
	});

	return (
		<div
			id='default-modal'
			class={`${isVisible.value} left-0 top-0 z-50 m-0 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black-trasparent`}
		>
			<div class='relative max-h-full max-w-2xl rounded-md bg-white p-6 shadow'>
				{/* <!-- Modal header --> */}
				<div class='flex items-center justify-between'>
					<h3 class='text-2xl font-bold text-dark-grey'>{state.title}</h3>
					<button
						type='button'
						class='inline-flex items-center justify-center text-2xl text-clara-red'
						onClick$={onClose}
					>
						{getIcon('Close')}
					</button>
				</div>
				{/* <!-- Modal body --> */}
				<div
					class={`${state.message ? 'py-4' : 'pb-4 pt-0'} my-4 space-y-4 border-b border-gray-200`}
				>
					{!state.message && <Slot />}
					{state.message && (
						<p class='text-sm font-normal text-dark-grey'>{state.message}</p>
					)}
				</div>
				{/* <!-- Modal footer --> */}
				<div class='flex items-center justify-end space-x-1'>
					{state.cancelLabel && (
						<Button variant={'link'} onClick$={onCancel}>
							{state.cancelLabel}
						</Button>
					)}

					{state.confirmLabel && (
						<Button disabled={state.isConfirmDisabled} onClick$={onConfirm}>
							{state.confirmLabel}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
});
