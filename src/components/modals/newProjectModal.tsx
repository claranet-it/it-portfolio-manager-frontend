import { $, Slot, component$, useComputed$, useStore } from '@builder.io/qwik';
import { t } from '../../locale/labels';
import { getIcon } from '../icons';

export const NewProjectModal = component$(() => {
	const modalStatus = useStore<{
		visible: boolean;
		x: number;
		y: number;
	}>({ visible: false, x: 0, y: 0 });

	const modalToggle = $((event: MouseEvent) => {
		const button = event.target as HTMLElement;

		modalStatus.x = button.offsetLeft;
		modalStatus.x = button.offsetTop;
		modalStatus.visible = !modalStatus.visible;
	});

	const modalStyle = useComputed$(() => {
		return {
			display: modalStatus.visible ? 'block' : 'none',
			transform: `translate(${modalStatus.x}px, ${modalStatus.y}px)`,
		};
	});

	return (
		<div class='w-full flex flex-row'>
			<button id='open-new-project-bt' onClick$={modalToggle} type='button'>
				<div class='flex flex-row space-x-1 content text-clara-red'>
					<span class='text-xl content-center'>{getIcon('Add')}</span>
					<span class='text-base font-bold content-center'>
						{t('add_new_project_label')}
					</span>
				</div>
			</button>

			<div id='form-new-project' style={modalStyle.value} class='fixed z-10'>
				<Slot />
			</div>
		</div>
	);
});
