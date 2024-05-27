import { $, Slot, component$ } from '@builder.io/qwik';
import { getIcon } from '../icons';
import { t } from '../../locale/labels';

export const NewProjectModal = component$(() => {
	return (
		<div class='w-full flex flex-row'>
			<button
				id='open-new-project-bt'
				data-dropdown-toggle='form-new-project'
				data-dropdown-placement='top'
				type='button'
			>
				<div class='flex flex-row space-x-1 content text-clara-red'>
					<span class='text-xl content-center'>{getIcon('Add')}</span>
					<span class='text-base font-bold content-center'>
						{t('add_new_project_label')}
					</span>
				</div>
			</button>

			<div id='form-new-project' class='hidden z-10'>
				<Slot />
			</div>
		</div>
	);
});
