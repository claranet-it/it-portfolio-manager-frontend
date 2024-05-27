import { component$, $, useStore } from '@builder.io/qwik';
import { t } from '../locale/labels';
import { getIcon } from '../components/icons';
import { NewProjectForm } from '../components/form/NewProjectForm';
import { Modal } from '../components/Modal';
import { ModalState } from '../models/modalState';
import { TimeSheetTable } from '../components/TimeSheetTable';
import { NewProjectModal } from '../components/modals/newProjectModal';

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
				<TimeSheetTable>
					<NewProjectModal q:slot='newProject'>
						<NewProjectForm
							alertMessageState={alertMessageState}
							onCancel$={newProjectCancelAction}
						/>
					</NewProjectModal>
				</TimeSheetTable>
			</div>

			<Modal state={alertMessageState} />
		</>
	);
});
