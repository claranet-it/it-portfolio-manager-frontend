import { $, Signal, Slot, component$, useComputed$, useStore, useTask$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { Project, ProjectType } from '@models/project';
import { format } from 'date-fns';
import { useTimeEntries } from '../../hooks/timesheet/useTimeEntries';
import { t } from '../../locale/labels';
import { Day, TimeEntry, TimeEntryObject, TimeEntryRow } from '../../models/timeEntry';
import { formatDateString } from '../../utils/dates';
import {
	convertTimeToDecimal,
	getFormattedHours,
	getProjectCateogriesProp,
	getTotalHours,
	getTotalHoursPerRows,
	getlHoursPerProject,
} from '../../utils/timesheet';

import { Task } from '@models/task';
import { INIT_PROJECT_VALUE, INIT_TASK_VALUE } from 'src/utils/constants';
import { Button } from '../Button';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';
import { TimeEntryElement } from './TimeEntryElement';

interface TimeSheetTableProps {
	newTimeEntry: Signal<TimeEntry | undefined>;
	days: Signal<Day[]>;
	from: Signal<Date>;
	to: Signal<Date>;
	userImpersonationId?: Signal<string | undefined>;
}

const HOURS_PER_DAY = 8;
const HOURS_PER_WEEK = 8 * 5;

export const TimeSheetTable = component$<TimeSheetTableProps>(
	({ newTimeEntry, days, from, to, userImpersonationId }) => {
		const { loadTimeEntries, state, updateTimeEntries, deleteProjectEntries } = useTimeEntries(
			newTimeEntry,
			userImpersonationId
		);
		/* Chiamata al BE per il templating attivo in questa settimana che mi crea questo tipo di entries */
		const templatingEntries: TimeEntry[] = [
			{
				isTemplating: true,
				user: 'maria.teresa.graziano@claranet.com',
				date: '2025-04-17',
				company: 'it',
				customer: 'Claranet',
				project: {
					name: 'Assenze',
					type: 'absence' as ProjectType,
					plannedHours: 100,
					completed: false,
				},
				task: 'FESTIVITA',
				hours: 8,
				description: '',
				startHour: '00:00',
				endHour: '00:00',
				index: 'd481526f-91b6-4865-afa6-667e939d4290',
			},
			{
				isTemplating: true,
				user: 'maria.teresa.graziano@claranet.com',
				date: '2025-04-15',
				company: 'it',
				customer: 'Claranet',
				project: {
					name: 'Assenze',
					type: 'absence' as ProjectType,
					plannedHours: 100,
					completed: false,
				},
				task: 'FERIE',
				hours: 8,
				description: '',
				startHour: '00:00',
				endHour: '00:00',
				index: 'd481526f-91b6-4865-afa6-667e939d4290',
			},
			{
				isTemplating: true,
				user: 'maria.teresa.graziano@claranet.com',
				date: '2025-04-18',
				company: 'it',
				customer: 'Claranet',
				project: {
					name: 'Assenze',
					type: 'absence' as ProjectType,
					plannedHours: 100,
					completed: false,
				},
				task: 'FERIE',
				hours: 8,
				description: '',
				startHour: '00:00',
				endHour: '00:00',
				index: 'd481526f-91b6-4865-afa6-667e939d4290',
			},
		];

		const timeEntriesState = useStore<Record<string, Record<string, number>>>({});

		const deleteTimeEntriesRowModalState = useStore<ModalState>({
			title: t('TIMESHEET_DELETE_ALERT_TITLE'),
			message: t('TIMESHEET_DELETE_ALERT_MESSAGE'),
		});

		const handleTimeChange = $(async (timeEntryObject: TimeEntryObject) => {
			const { project, date, hours } = timeEntryObject;

			if (!timeEntriesState[project.name]) {
				timeEntriesState[project.name] = {};
			}
			timeEntriesState[project.name][date] = hours;

			// This functions will ignore the change if the user passes over a time entry without editing it
			const ignoreChange = () => {
				const { index, hours, date, project, task, startHour, endHour, description } =
					timeEntryObject;

				// If the recorded hours for the date differ from the current state, return false
				if (timeEntriesState[project.name][date] !== hours) return false;

				// Find an existing entry matching the given criteria
				const entryExists = state.dataTimeEntries.find(
					(entry) =>
						entry.index === index &&
						entry.date === date &&
						entry.project.name === project.name &&
						entry.project.type === project.type &&
						entry.task.name === task.name
				);

				// If no entry exists, ignore only if hours are zero
				if (!entryExists) return hours === 0;

				// Check if any of the key values have changed
				const hasChanged =
					entryExists.hours !== hours ||
					entryExists.startHour !== startHour ||
					entryExists.endHour !== endHour ||
					entryExists.description !== description;

				return !hasChanged;
			};

			if (ignoreChange()) {
				return;
			}

			await updateTimeEntries(timeEntryObject);
		});

		const deleteHandler = $((entries: TimeEntry[]) => {
			if (entries.findIndex((entry) => !entry.isUnsaved) !== -1) {
				deleteTimeEntriesRowModalState.isVisible = true;
				deleteTimeEntriesRowModalState.confirmLabel = t('ACTION_CONFIRM');
				deleteTimeEntriesRowModalState.cancelLabel = t('ACTION_CANCEL');
				deleteTimeEntriesRowModalState.onConfirm$ = $(() => {
					entries.forEach((entry) => deleteProjectEntries(entry));
				});

				return;
			}

			entries.forEach((entry) => deleteProjectEntries(entry));
		});

		useTask$(async ({ track }) => {
			track(() => from.value);
			track(() => to.value);
			track(() => userImpersonationId?.value);
			await loadTimeEntries(from, to, userImpersonationId);
		});

		const getTotalPerDay = (timeEntries: TimeEntry[]) => {
			return getFormattedHours(getTotalHours(getlHoursPerProject(timeEntries)));
		};

		const dayHasTooManyHours = (timeEntries: TimeEntry[]) => {
			return getTotalHours(getlHoursPerProject(timeEntries)) > HOURS_PER_DAY;
		};

		const getTotal = (hours: number[]) => {
			return getFormattedHours(getTotalHoursPerRows(hours));
		};

		const weekHasTooManyHours = (hours: number[]) => {
			return getTotalHoursPerRows(hours) > HOURS_PER_WEEK;
		};

		const getTotalPerProject = (hours: number[]) => {
			return getFormattedHours(getTotalHoursPerRows(hours));
		};

		const groupedByProject = useComputed$(() => {
			const entriesConfirmed = state.dataTimeEntries.reduce<TimeEntryRow>((acc, entry) => {
				const key = `${entry.customer}-${entry.project.name}-${entry.task}`;

				if (!acc[key]) {
					acc[key] = [];
				}

				acc[key].push(entry);
				return acc;
			}, {});

			const entriesTemplating = templatingEntries.reduce<TimeEntryRow>((acc, entry) => {
				const key = `${entry.customer}-${entry.project.name}-${entry.task}`;

				if (!acc[key]) {
					acc[key] = [];
				}

				acc[key].push(entry);
				return acc;
			}, {});
			/* TODO aggiungerli qui? insieme? */
			console.log('#### entriesConfirmed', entriesConfirmed);
			console.log('#### entriesTemplating', entriesTemplating);

			return { ...entriesConfirmed, ...entriesTemplating };
		});

		const extractFirstEntryDetails = (entries: TimeEntry[]) => {
			if (entries.length === 0) return {};
			const { customer, project, task } = entries[0];
			return { customer, project, task };
		};

		const setNewTimeEntry = $(
			(date: string, customer?: string, project?: Project, task?: Task) => {
				newTimeEntry.value = {
					date: date,
					company: 'it',
					customer: customer || '',
					project: project || INIT_PROJECT_VALUE,
					task: task || INIT_TASK_VALUE,
					hours: 0,
					isUnsaved: true,
				};
			}
		);

		const fistBodyColumnStyle = (type: ProjectType) => {
			const color = getProjectCateogriesProp(type).borderColor;
			return `px-6 py-4 font-medium text-left border border-surface-50 whitespace-wrap shadow-inset-leftBorder ${color}`;
		};

		const todayStyle = (day: Day) => {
			const currentDate = new Date();

			const isToday =
				day.date.getDate() === currentDate.getDate() &&
				day.date.getMonth() === currentDate.getMonth() &&
				day.date.getFullYear() === currentDate.getFullYear();

			const tdClass = isToday
				? 'bg-surface-50 border border-2 border-darkgray-500 px-4 py-3'
				: 'border border-surface-70 px-4 py-3';

			return tdClass;
		};

		const weekHours = state.dataTimeEntries.map((item) => item.hours);

		return (
			<div class='relative overflow-x-auto'>
				<table class='w-full'>
					<thead class='bg-surface-20 py-3 text-xs text-gray-700'>
						<tr>
							<th scope='col' class='border border-surface-70 px-6 text-left'>
								<h3 class='text-base text-dark-grey'>
									{t('TIMESHEET_TABLE_PROJECT_COL_LABEL')}
								</h3>
							</th>
							{days.value.map((day, key) => (
								<th key={key} scope='col' class={todayStyle(day)}>
									<div class='flex flex-col text-dark-grey'>
										<h3 class='text-base font-bold'>{day.name}</h3>
										<span class='text-xs font-normal uppercase'>
											{format(day.date, 'MMM d')}
										</span>
									</div>
								</th>
							))}
							<th scope='col' class='border border-surface-70 px-4 py-3'>
								<h3 class='text-base font-bold'>
									{t('TIMESHEET_TABLE_TOTAL_COL_LABEL')}
								</h3>
							</th>
							<th scope='col' class='border border-surface-70 px-4 py-3'>
								<h3 class='text-base font-bold'>
									{t('TIMESHEET_TABLE_ACTIONS_COL_LABEL')}
								</h3>
							</th>
						</tr>
					</thead>
					<tbody
						key={`timesheet-table-${state.dataTimeEntries.length}-${state.from.value.getTime()}-${state.to.value.getTime()}`}
					>
						{Object.entries(groupedByProject.value).map(([_, entries], key) => {
							const { customer, project, task } = extractFirstEntryDetails(entries);
							return (
								<tr key={key} class='border-b bg-white'>
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
											<h4 class='text-dark-gray-900 text-sm font-normal'>
												{`${t('TASK')}: ${typeof task === 'string' ? task : task?.name}`}
											</h4>
										</div>
									</th>
									{days.value.map((day) => {
										const formattedDate = formatDateString(day.date);
										const dailyEntries = entries
											.filter((e) => e.date === formattedDate)
											.sort((a, b) => {
												if (a.startHour && b.startHour) {
													return (
														convertTimeToDecimal(a.startHour) -
														convertTimeToDecimal(b.startHour)
													);
												}
												return 0;
											});

										const dEntries: Array<TimeEntry | undefined> =
											dailyEntries.length ? dailyEntries : [undefined];

										const tdClass = `relative py-3 px-4 text-center border border-surface-50 ${day.weekend ? 'bg-surface-20' : ''}`;

										return (
											<td
												key={`day-${formattedDate}-${dEntries.length}`}
												class={tdClass}
											>
												{dEntries.map((dEntry, index) => {
													const {
														hours = undefined,
														startHour = '0',
														endHour = '0',
														index: entryIndex = undefined,
													} = dEntry || {};
													const key = `${index}-${hours}-${startHour}-${endHour}-${entryIndex}`;
													const isLastEntry =
														index === dEntries.length - 1;

													return (
														<div
															class='relative'
															key={`entry-${key}-${formattedDate}`}
														>
															<div
																class={`relative ${
																	dEntries.length > 1 &&
																	isLastEntry
																		? 'mb-6'
																		: 'mb-2'
																} `}
															>
																<TimeEntryElement
																	key={key}
																	id={key}
																	day={day}
																	entry={dEntry}
																	entryInfo={{
																		customer,
																		project,
																		task,
																	}}
																	handleTimeChange={
																		handleTimeChange
																	}
																	timeEntriesState={
																		timeEntriesState
																	}
																/>
															</div>
															{isLastEntry &&
																hours !== 0 &&
																hours !== undefined && (
																	<div
																		class={'relative bottom-1'}
																	>
																		<Button
																			key={`new-entry-${dailyEntries.length + 1}`}
																			tabIndex={-1}
																			variant={'link'}
																			size={'xxsmall'}
																			onClick$={() =>
																				setNewTimeEntry(
																					formattedDate,
																					customer,
																					project,
																					task
																				)
																			}
																		>
																			<div class='flex flex-row items-center gap-1 [&_svg]:w-[10px]'>
																				{getIcon('Add')}
																				<span class='text-[8px] font-bold'>
																					{t(
																						'ADD_TIME_ENTRY_LABEL'
																					)}
																				</span>
																			</div>
																		</Button>
																	</div>
																)}
														</div>
													);
												})}
											</td>
										);
									})}
									<td class='border border-surface-50 px-4 py-3 text-center'>
										<span class='text-base font-normal'>
											{getTotalPerProject(
												entries.map((entry) => entry.hours)
											)}
										</span>
									</td>
									<td class='border border-surface-50 px-4 py-3 text-center'>
										<button onClick$={() => deleteHandler(entries)}>
											{getIcon('Bin')}
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
					<tfoot>
						<tr class='bg-surface-5'>
							<td colSpan={8} class='border border-surface-50 px-6 py-4'>
								<Slot name='newProject' />
							</td>
							<td colSpan={2} class='border border-surface-50 px-6 py-4'>
								<Slot name='confirmTimes' />
							</td>
						</tr>
						<tr class='bg-surface-20'>
							<th
								scope='row'
								class='border border-surface-50 px-6 py-4 text-left text-base'
							>
								<h3 class='text-base font-bold text-dark-grey'>
									{t('TIMESHEET_TABLE_TOTAL_FOOTER_LABEL')}
								</h3>
							</th>

							{days.value.map((day, key) => {
								const entriesForDay = state.dataTimeEntries.filter(
									(t) => t.date === formatDateString(day.date)
								);

								const showAlert = dayHasTooManyHours(entriesForDay);

								return (
									<td
										key={key}
										class='border border-surface-50 px-6 py-4 text-center'
									>
										<span class='flex items-center justify-center text-base font-bold'>
											{getTotalPerDay(entriesForDay)}
											{showAlert && (
												<span class='material-symbols-outlined text-clara-red'>
													exclamation
												</span>
											)}
										</span>
									</td>
								);
							})}

							<td class='border border-surface-50 px-6 py-4 text-right' colSpan={2}>
								<span class='flex items-center justify-center text-base font-bold'>
									{getTotal(weekHours)}
									{weekHasTooManyHours(weekHours) && (
										<span class='material-symbols-outlined text-clara-red'>
											exclamation
										</span>
									)}
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
