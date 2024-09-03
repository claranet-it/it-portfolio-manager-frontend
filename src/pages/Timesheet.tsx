import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { TimeEntry } from '@models/timeEntry';
import { Button } from 'src/components/Button';
import { NewTaskForm } from 'src/components/form/NewTaskForm';
import { WeekSelector } from 'src/components/form/WeekSelector';
import { NewTimeEntryModal } from 'src/components/modals/NewTimeEntryModal';
import { ProjectCategoryLegend } from 'src/components/timesheet/ProjectCategoryLegend';
import { TimeSheetTable } from 'src/components/timesheet/TimeSheetTable';
import { useGetTimeSheetDays } from 'src/hooks/timesheet/useGetTimeSheetDays';
import { Modal } from '../components/modals/Modal';
import { t } from '../locale/labels';

export const Timesheet = component$(() => {
	const newProjectCancelAction = $(() => {
		const button = document.getElementById('open-new-project-bt');
		button?.click();
	});

	// Init statement to handler modal alert
	const alertMessageState = useStore<ModalState>({});
	const newTimeEntry = useSignal<TimeEntry>();
	const { days, from, to, nextWeek, prevWeek, currentWeek, setWeek } = useGetTimeSheetDays();

	return (
		<>
			<div class='w-full space-y-6 px-6 pt-2.5'>
				<div class='flex flex-col gap-2'>
					<h1 class='text-2xl font-bold text-darkgray-900'>
						{t('TIMESHEET_PAGE_TITLE')}
					</h1>
					<div class='items-between flex items-end justify-between'>
						<ProjectCategoryLegend />

						<div class='flex items-end justify-end gap-2'>
							<WeekSelector
								title={t('DATARANGE_SELECT_WEEK_LABEL')}
								from={from}
								to={to}
								nextAction={nextWeek}
								prevAction={prevWeek}
								confirmChangeRange={setWeek}
							/>
							<Button variant={'outline'} onClick$={currentWeek}>
								{t('THIS_WEEK')}
							</Button>
						</div>
					</div>
				</div>

				<TimeSheetTable newTimeEntry={newTimeEntry} days={days} from={from} to={to}>
					<NewTimeEntryModal q:slot='newProject'>
						<NewTaskForm
							timeEntry={newTimeEntry}
							alertMessageState={alertMessageState}
							onCancel$={newProjectCancelAction}
						/>
					</NewTimeEntryModal>
				</TimeSheetTable>
			</div>

			<Modal state={alertMessageState}>
				<p q:slot='modalBody' class='text-dark-gray text-base leading-relaxed'>
					{alertMessageState.message}
				</p>
			</Modal>
		</>
	);
});
