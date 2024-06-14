import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { TimeEntry } from '@models/timeEntry';
import { Button } from 'src/components/Button';
import { TimeSheetTable } from 'src/components/TimeSheetTable';
import { DataRange } from 'src/components/form/DataRange';
import { NewProjectModal } from 'src/components/modals/newProjectModal';
import { useGetTimeSheetDays } from 'src/hooks/timesheet/useGetTimeSheetDays';
import { Modal } from '../components/Modal';
import { NewProjectForm } from '../components/form/NewProjectForm';
import { t } from '../locale/labels';

export const Timesheet = component$(() => {
	const newProjectCancelAction = $(() => {
		const button = document.getElementById('open-new-project-bt');
		button?.click();
	});

	// Init statement to handler modal alert
	const alertMessageState = useStore<ModalState>({});
	const newTimeEntry = useSignal<TimeEntry>();
	const { days, from, to, nextWeek, prevWeek, currentWeek } = useGetTimeSheetDays();

	return (
		<>
			<div class='w-full px-3 pt-2.5 space-y-6'>
				<div class='flex sm:flex-col md:flex-row lg:flex-row md:items-end md:justify-between lg:items-end lg:justify-between'>
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

				<TimeSheetTable newTimeEntry={newTimeEntry} days={days} from={from} to={to}>
					<NewProjectModal q:slot='newProject'>
						<NewProjectForm
							timeEntry={newTimeEntry}
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
