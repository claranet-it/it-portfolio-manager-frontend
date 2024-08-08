import { $, Signal, Slot, component$, useComputed$, useStore, useTask$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { ProjectType } from '@models/project';
import { format } from 'date-fns';
import { useTimeEntries } from '../../hooks/timesheet/useTimeEntries';
import { t } from '../../locale/labels';
import { Day, TimeEntry, TimeEntryObject, TimeEntryRow } from '../../models/timeEntry';
import { formatDateString } from '../../utils/dates';
import {
	getFormattedHours,
	getProjectCateogriesProp,
	getTotalHours,
	getTotalHoursPerRows,
	getlHoursPerProject,
} from '../../utils/timesheet';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';
import { TimeEntryElement } from './TimeEntryElement';

interface TimeSheetTableProps {
	newTimeEntry: Signal<TimeEntry | undefined>;
	days: Signal<Day[]>;
	from: Signal<Date>;
	to: Signal<Date>;
}

export const TimeSheetTable = component$<TimeSheetTableProps>(
	({ newTimeEntry, days, from, to }) => {
		const { loadTimeEntries, state, updateTimeEntries, deleteProjectEntries } =
			useTimeEntries(newTimeEntry);

		const timeEntriesState = useStore<Record<string, Record<string, number>>>({});

		const deleteTimeEntriesRowModalState = useStore<ModalState>({
			title: t('TIMESHEET_DELETE_ALERT_TITLE'),
			message: t('TIMESHEET_DELETE_ALERT_MESSAGE'),
		});

		const handleTimeChange = $((timeEntryObject: TimeEntryObject) => {
			const { project, date, hours } = timeEntryObject;

			if (!timeEntriesState[project.name]) {
				timeEntriesState[project.name] = {};
			}
			timeEntriesState[project.name][date] = hours;

			updateTimeEntries(timeEntryObject);
		});

		const deleteHandler = $((entry: TimeEntry) => {
			if (!entry.isUnsaved) {
				deleteTimeEntriesRowModalState.isVisible = true;
				deleteTimeEntriesRowModalState.confirmLabel = t('ACTION_CONFIRM');
				deleteTimeEntriesRowModalState.cancelLabel = t('ACTION_CANCEL');
				deleteTimeEntriesRowModalState.onConfirm$ = $(() => {
					deleteProjectEntries(entry);
				});

				return;
			}

			deleteProjectEntries(entry);
		});

		useTask$(async ({ track }) => {
			track(() => from.value);
			track(() => to.value);
			await loadTimeEntries(from, to, true);
		});

		const getTotalPerDay = (timeEntries: TimeEntry[]) => {
			return getFormattedHours(getTotalHours(getlHoursPerProject(timeEntries)));
		};

		const getTotal = (hours: number[]) => {
			return getFormattedHours(getTotalHoursPerRows(hours));
		};

		const getTotalPerProject = (hours: number[]) => {
			return getFormattedHours(getTotalHoursPerRows(hours));
		};

		const groupedByProject = useComputed$(() => {
			return state.dataTimeEntries.reduce<TimeEntryRow>((acc, entry) => {
				const key = `${entry.customer}-${entry.project}-${entry.task}-${entry.index}`;

				if (!acc[key]) {
					acc[key] = [];
				}

				acc[key].push(entry);
				return acc;
			}, {});
		});

		const extractFirstEntryDetails = (entries: TimeEntry[]) => {
			if (entries.length === 0) return {};
			const { customer, project, task } = entries[0];
			return { customer, project, task };
		};

		const fistBodyColumnStyle = (type: ProjectType) => {
			const color = getProjectCateogriesProp(type).borderColor;
			return `px-6 py-4 font-medium text-left border border-surface-50 whitespace-wrap shadow-inset-leftBorder ${color}`;
		};

		return (
			<div class='relative overflow-x-auto'>
				<table class='w-full'>
					<thead class='text-xs text-gray-700 bg-surface-20 py-3'>
						<tr>
							<th scope='col' class='px-6 text-left border border-surface-70'>
								<h3 class='text-base text-dark-grey'>
									{t('TIMESHEET_TABLE_PROJECT_COL_LABLE')}
								</h3>
							</th>
							{days.value.map((day, key) => (
								<th
									key={key}
									scope='col'
									class='py-3 px-4 border border-surface-70'
								>
									<div class='flex flex-col text-dark-grey'>
										<h3 class='text-base font-bold'>{day.name}</h3>
										<span class='text-xs font-normal uppercase'>
											{format(day.date, 'MMM d')}
										</span>
									</div>
								</th>
							))}
							<th scope='col' class='py-3 px-4 border border-surface-70'>
								<h3 class='text-base font-bold'>
									{t('TIMESHEET_TABLE_TOTAL_COL_LABLE')}
								</h3>
							</th>
							<th scope='col' class='py-3 px-4 border border-surface-70'>
								<h3 class='text-base font-bold'>
									{t('TIMESHEET_TABLE_ACTIONS_COL_LABLE')}
								</h3>
							</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(groupedByProject.value).map(([_, entries], key) => {
							const { customer, project, task } = extractFirstEntryDetails(entries);
							return (
								<tr key={key} class='bg-white border-b'>
									<th
										scope='row'
										class={fistBodyColumnStyle(project?.type ?? '')}
									>
										<div class='flex flex-col'>
											<h4 class='text-sm font-normal text-darkgray-500'>
												{`${t('CLIENT')}: ${customer}`}
											</h4>
											<h4 class='text-base font-bold text-dark-grey'>
												{project?.name}
											</h4>
											<h4 class='text-sm font-normal text-dark-gray-900'>
												{`${t('TASK')}: ${task}`}
											</h4>
										</div>
									</th>
									{days.value.map((day, index) => {
										const formattedDate = formatDateString(day.date);
										const entry = entries.find((e) => e.date === formattedDate);
										const {
											hours = 0,
											startHour = '0',
											endHour = '0',
											index: entryIndex = undefined,
										} = entry || {};
										const key = `${index}-${formattedDate}-${hours}-${startHour}-${endHour}-${entryIndex}`;

										return (
											<TimeEntryElement
												key={key}
												id={key}
												day={day}
												entry={entry}
												entryInfo={{
													customer,
													project,
													task,
												}}
												handleTimeChange={handleTimeChange}
												timeEntriesState={timeEntriesState}
											/>
										);
									})}
									<td class='py-3 px-4 text-center border border-surface-50'>
										<span class='text-base font-normal'>
											{getTotalPerProject(
												entries.map((entry) => entry.hours)
											)}
										</span>
									</td>
									<td class='py-3 px-4 text-center border border-surface-50'>
										<button onClick$={() => deleteHandler(entries[0])}>
											{getIcon('Bin')}
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
					<tfoot>
						<tr class='bg-surface-5'>
							<td colSpan={10} class='px-6 py-4 border border-surface-50'>
								<Slot name='newProject' />
							</td>
						</tr>
						<tr class='bg-surface-20'>
							<th
								scope='row'
								class='px-6 py-4 text-left text-base border border-surface-50'
							>
								<h3 class='text-base font-bold text-dark-grey'>
									{t('TIMESHEET_TABLE_TOTAL_FOOTER_LABLE')}
								</h3>
							</th>
							{days.value.map((day, key) => {
								return (
									<td
										key={key}
										class='px-6 py-4 text-center border border-surface-50'
									>
										<span class='text-base font-bold'>
											{getTotalPerDay(
												state.dataTimeEntries.filter(
													(t) => t.date === formatDateString(day.date)
												)
											)}
										</span>
									</td>
								);
							})}
							<td class='px-6 py-4 text-right border border-surface-50' colSpan={2}>
								<span class='text-base font-bold'>
									{getTotal(state.dataTimeEntries.map((item) => item.hours))}
								</span>
							</td>
						</tr>
					</tfoot>
				</table>
				<Modal state={deleteTimeEntriesRowModalState} />
			</div>
		);
	}
);
