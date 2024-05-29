import { component$, $, useStore } from '@builder.io/qwik';
import { NewProjectForm } from '../components/form/NewProjectForm';
import { Modal } from '../components/Modal';
import { ModalState } from '../models/modalState';
import { TimeSheetTable } from '../components/TimeSheetTable';
import { NewProjectModal } from '../components/modals/newProjectModal';
import { TimeEntry } from '../models/timeEntry';

export const Timesheet = component$(() => {
	const newProjectCancelAction = $(() => {
		const button = document.getElementById('open-new-project-bt');
		button?.click();
	});

	// Init statement to handler modal alert
	const alertMessageState = useStore<ModalState>({});
	const timeEntries = useStore<TimeEntry[]>([]);

	return (
		<>
			<div class='w-full px-3 pt-2.5 space-y-3'>
				<TimeSheetTable timeEntries={timeEntries}>
					<NewProjectModal q:slot='newProject'>
						<NewProjectForm
							timeEntries={timeEntries}
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
