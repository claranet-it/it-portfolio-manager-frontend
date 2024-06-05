import { $, Signal, Slot, component$, useStore, useTask$ } from '@builder.io/qwik';
import { format } from 'date-fns';
import moment from 'moment';
import { useGetTimeEntries } from '../hooks/timesheet/useGetTimeEntries';
import { t } from '../locale/labels';
import { ModalState } from '../models/ModalState';
import { Day, TimeEntry } from '../models/timeEntry';
import { TimePicker } from './form/TimePicker';
import { getIcon } from './icons';
import { Modal } from './modals/Modal';

interface TimeSheetTableProps {
	timeEntries: TimeEntry[];
	days: Signal<Day[]>;
}

export const getTotalHoursPerDay = (hours: number[]) => {
	return hours.length > 0 ? hours.reduce((total, amount) => total + amount) : 0;
};

export const getlHoursPerProject = (timeEntries: TimeEntry[]) => {
	return timeEntries.map((item) => item.hours);
};

export const getFormattedHours = (hours: number) => {
	return moment(hours, 'HH').format('HH:mm');
};

export const TimeSheetTable = component$<TimeSheetTableProps>(({ timeEntries, days }) => {
	const { loadTimeEntries } = useGetTimeEntries(timeEntries);
	const editTimeModal = useStore<ModalState>({
		title: 'Edit time',
	});

	const NEW_PROJECT_ROW_COLSPAN = 10;

	useTask$(() => {
		loadTimeEntries();
	});

	const getTotalPerDay = () => {
		return getFormattedHours(getTotalHoursPerDay(getlHoursPerProject(timeEntries)));
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
					{timeEntries.map((entry, key) => {
						return (
							<tr key={key} class='bg-white border-b'>
								<th
									scope='row'
									class='px-6 py-4 font-medium text-left border border-surface-50 whitespace-wrap'
								>
									<div class='flex flex-col'>
										<h4 class='text-sm font-normal text-darkgray-500'>
											{entry.customer}
										</h4>
										<h4 class='text-base font-bold text-dark-grey'>
											{entry.project}
										</h4>
										<h4 class='text-sm font-normal text-dark-gray-900'>
											{entry.task}
										</h4>
									</div>
								</th>
								{days.value.map((day, key) => {
									return (
										<td class='py-3 px-4 text-center border border-surface-50'>
											<TimePicker
												key={key}
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
									<span class='text-base font-normal'>7:00</span>
								</td>
								<td class='py-3 px-4 text-center border border-surface-50'>
									<button>{getIcon('Bin')}</button>
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
						{days.value.map((_, key) => {
							return (
								<td
									key={key}
									class='px-6 py-4 text-center border border-surface-50'
								>
									<span class='text-base font-bold'>{getTotalPerDay()}</span>
								</td>
							);
						})}
						<td class='px-6 py-4 text-right border border-surface-50' colSpan={2}>
							<span class='text-base font-bold'>40:00</span>
						</td>
					</tr>
				</tfoot>
			</table>

			<Modal state={editTimeModal}></Modal>
		</div>
	);
});
