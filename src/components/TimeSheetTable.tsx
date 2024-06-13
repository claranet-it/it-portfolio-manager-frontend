import { $, Signal, Slot, component$, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { format } from 'date-fns';
import { useGetTimeEntries } from '../hooks/timesheet/useGetTimeEntries';
import { t } from '../locale/labels';
import { ModalState } from '../models/ModalState';
import { Day, TimeEntry } from '../models/timeEntry';
import { formatDateString } from '../utils/dates';
import {
	getFormattedHours,
	getTotalHours,
	getTotalHoursPerRows,
	getlHoursPerProject,
} from '../utils/timesheet';
import { TimePicker } from './form/TimePicker';
import { getIcon } from './icons';
import { Modal } from './modals/Modal';

interface TimeSheetTableProps {
	newTimeEntry: Signal<TimeEntry | undefined>;
	days: Signal<Day[]>;
	from: Signal<Date>;
	to: Signal<Date>;
}

export const TimeSheetTable = component$<TimeSheetTableProps>(
	({ newTimeEntry, days, from, to }) => {
		const { loadTimeEntries, deleteProjectEntries, state } = useGetTimeEntries(newTimeEntry);
		const editTimeModal = useStore<ModalState>({
			title: 'Edit time',
		});

		const NEW_PROJECT_ROW_COLSPAN = 10;

		useTask$(async ({ track }) => {
			track(() => from.value);
			track(() => to.value);
			await loadTimeEntries(from, to);
		});

		const { dataTimeEntries } = state;

		const getTotalPerDay = (timeEntries: TimeEntry[]) => {
			return getFormattedHours(getTotalHours(getlHoursPerProject(timeEntries)));
		};

		const getTotal = (hours: number[]) => {
			return getFormattedHours(getTotalHoursPerRows(hours));
		};

		const getTotalPerProject = (hours: number[]) => {
			return getFormattedHours(getTotalHoursPerRows(hours));
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
							{days.value.map((day, key) => {
								return (
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
								);
							})}
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
						{dataTimeEntries.map((entry, key) => {
							return (
								<tr key={key} class='bg-white border-b'>
									<th
										scope='row'
										class='px-6 py-4 font-medium text-left border border-surface-50 whitespace-wrap'
									>
										<div class='flex flex-col'>
											<h4 class='text-sm font-normal text-darkgray-500'>
												{`${t('CLIENT')}: ` + entry.customer}
											</h4>
											<h4 class='text-base font-bold text-dark-grey'>
												{entry.project}
											</h4>
											<h4 class='text-sm font-normal text-dark-gray-900'>
												{`${t('TASK')}: ` + entry.task}
											</h4>
										</div>
									</th>

									{/* Weekly day columns*/}
									{days.value.map((day, key) => {
										const formattedDate = formatDateString(day.date);
										const isDateMatch = formattedDate === entry.date;
										return (
											<td class='py-3 px-4 text-center border border-surface-50'>
												<TimePicker
													key={key}
													onChange$={() => {}}
													bindValue={useSignal(
														isDateMatch
															? getFormattedHours(entry.hours)
															: getFormattedHours(0)
													)}
													onClick$={$(() => {
														<Modal state={{ isVisible: true }}>
															<p
																q:slot='modalBody'
																class='text-base leading-relaxed text-dark-gray'
															>
																{day.name}
															</p>
														</Modal>;
													})}
												/>
											</td>
										);
									})}

									<td class='py-3 px-4 text-center border border-surface-50'>
										<span class='text-base font-normal'>
											{getTotalPerProject(
												days.value.map(
													(_, dayIndex) =>
														dataTimeEntries[dayIndex]?.hours ?? []
												)
											)}
										</span>
									</td>
									<td class='py-3 px-4 text-center border border-surface-50'>
										<button onClick$={() => deleteProjectEntries(entry)}>
											{getIcon('Bin')}
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
					<tfoot>
						<tr class='bg-surface-5'>
							<td
								colSpan={NEW_PROJECT_ROW_COLSPAN}
								class='px-6 py-4 border border-surface-50 '
							>
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
												dataTimeEntries.filter(
													(t) => t.date === formatDateString(day.date)
												)
											)}
										</span>
									</td>
								);
							})}
							<td class='px-6 py-4 text-right border border-surface-50' colSpan={2}>
								<span class='text-base font-bold'>
									{getTotal(dataTimeEntries.map((item) => item.hours))}
								</span>
							</td>
						</tr>
					</tfoot>
				</table>

				<Modal state={editTimeModal}></Modal>
			</div>
		);
	}
);
