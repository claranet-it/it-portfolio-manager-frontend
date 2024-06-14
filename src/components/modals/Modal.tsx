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
	});

	const isVisible = useComputed$(() => {
		return state.isVisible ? 'fixed' : 'hidden';
	});

	return (
		<div
			id='default-modal'
			aria-hidden='true'
			class={`${isVisible.value} overflow-y-auto overflow-x-hidden top-0 left-0 z-50 m-0 flex justify-center items-center w-full h-full bg-black-trasparent`}
		>
			<div class='relative p-6  max-w-2xl max-h-full bg-white rounded-md shadow'>
				{/* <!-- Modal header --> */}
				<div class='flex items-center justify-between'>
					<h3 class='text-2xl font-bold text-dark-grey'>{state.title}</h3>
					<button
						type='button'
						class='text-2xl text-clara-red inline-flex justify-center items-center'
						onClick$={onClose}
					>
						{getIcon('Close')}
					</button>
				</div>
				{/* <!-- Modal body --> */}
				<div class='py-4 space-y-4 my-4 border-b border-gray-200'>
					{state.body && <Slot name='modalBody' />}
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
						<Button onClick$={onConfirm}>{state.confirmLabel}</Button>
					)}
				</div>
			</div>
		</div>
	);
});
