import { component$, $, useStore } from '@builder.io/qwik';
import { NewProjectForm } from '../components/form/NewProjectForm';
import { Modal } from '../components/Modal';
import { ModalState } from '../models/modalState';
import { TimeSheetTable } from '../components/TimeSheetTable';
import { NewProjectModal } from '../components/modals/newProjectModal';
import { TimeEntry } from '../models/timeEntry';
import { DataRange } from '../components/form/DataRange';
import { useGetTimeSheetDays } from '../hooks/timesheet/useGetTimeSheetDays';

export const Timesheet = component$(() => {
	const newProjectCancelAction = $(() => {
		const button = document.getElementById('open-new-project-bt');
		button?.click();
	});

	// Init statement to handler modal alert
	const alertMessageState = useStore<ModalState>({});
	const timeEntries = useStore<TimeEntry[]>([]);
	const { days, from, to, nextWeek, prevWeek } = useGetTimeSheetDays();

	return (
		<>
			<div class='w-full px-3 pt-2.5 space-y-6'>
				<div class='flex flex-row md:justify-between lg:justify-between'>
					<div class='flex flex-col'>
						<h1 class='text-2xl font-bold text-darkgray-900'>My timesheet</h1>
					</div>

					<DataRange from={from} to={to} nextAction={nextWeek} prevAction={prevWeek} />
				</div>

				<TimeSheetTable timeEntries={timeEntries} days={days}>
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
