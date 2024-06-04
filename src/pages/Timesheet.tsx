import { $, component$, useStore } from '@builder.io/qwik';
import { Button } from '../components/Button';
import { TimeSheetTable } from '../components/TimeSheetTable';
import { DataRange } from '../components/form/DataRange';
import { NewProjectForm } from '../components/form/NewProjectForm';
import { Modal } from '../components/modals/Modal';
import { NewProjectModal } from '../components/modals/newProjectModal';
import { useGetTimeSheetDays } from '../hooks/timesheet/useGetTimeSheetDays';
import { t } from '../locale/labels';
import { ModalState } from '../models/ModalState';
import { TimeEntry } from '../models/timeEntry';

export const Timesheet = component$(() => {
	const newProjectCancelAction = $(() => {
		const button = document.getElementById('open-new-project-bt');
		button?.click();
	});

	// Init statement to handler modal alert
	const alertMessageState = useStore<ModalState>({});
	const timeEntries = useStore<TimeEntry[]>([]);
	const { days, from, to, nextWeek, prevWeek, currentWeek } = useGetTimeSheetDays();

	return (
		<>
			<div class='w-full px-3 pt-2.5 space-y-6'>
				<div class='flex flex-row items-end justify-between'>
					<h1 class='text-2xl font-bold text-darkgray-900'>My timesheet</h1>
					<div class='flex items-end justify-end gap-2'>
						<DataRange
							from={from}
							to={to}
							nextAction={nextWeek}
							prevAction={prevWeek}
						/>
						<Button variant={'outline'} onClick$={currentWeek}>
							{t('THIS_WEEK')}
						</Button>
					</div>
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

			<Modal state={alertMessageState}>
				<p q:slot='modalBody' class='text-base leading-relaxed text-dark-gray'>
					{alertMessageState.message}
				</p>
			</Modal>
		</>
	);
});
