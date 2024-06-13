import { component$, $, useStore } from '@builder.io/qwik';
import { t } from '../locale/labels';
import { getIcon } from '../components/icons';
import { NewProjectForm } from '../components/form/NewProjectForm';
import { Modal } from '../components/Modal';
import { ModalState } from '../models/modalstate';

export const Timesheet = component$(() => {
	const newProjectCancelAction = $(() => {
		const button = document.getElementById('open-new-project-bt');
		button?.click();
	});

	// Init statement to handler modal alert
	const alertMessageState = useStore<ModalState>({});

	return (
		<>
			<div class='w-full px-3 pt-2.5 space-y-3'>
				<div class='h-[500px]'></div>
				<div class='w-full px-10 py-3 bg-surface-70 flex flex-row'>
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
						<NewProjectForm
							alertMessageState={alertMessageState}
							onCancel$={newProjectCancelAction}
						/>
					</div>
				</div>
			</div>

			<Modal state={alertMessageState} />
		</>
	);
});
