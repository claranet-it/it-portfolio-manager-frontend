import { $, component$, Slot, useComputed$, useSignal } from '@builder.io/qwik';
import { t } from 'src/locale/labels';
import { getIcon } from '../icons';

export const NewProjectOverlayModal = component$(() => {
	const modalVisible = useSignal(false);

	const modalToggle = $(() => {
		modalVisible.value = !modalVisible.value;
	});

	const modalStyle = useComputed$(() => {
		return {
			display: modalVisible.value ? 'block' : 'none',
		};
	});

	return (
		<>
			<div class='w-full flex flex-row'>
				<button id='open-new-project-bt' onClick$={modalToggle} type='button'>
					<div class='flex flex-row space-x-1 content text-clara-red'>
						<span class='text-xl content-center'>{getIcon('Add')}</span>
						<span class='text-base font-bold content-center'>
							{t('add_new_project_label')}
						</span>
					</div>
				</button>
			</div>
			{modalVisible.value && (
				<div
					id='default-modal'
					class={`${modalStyle.value} overflow-y-auto overflow-x-hidden top-0 left-0 z-50 m-0 flex justify-center items-center w-full h-full bg-black-trasparent`}
					style={{ position: 'fixed' }}
				>
					<Slot />
				</div>
			)}
		</>
	);
});
