import { component$, QRL } from '@builder.io/qwik';
import { Template } from '@models/template';
import { intervalIntersect, isInInterval } from 'src/utils/dateIntervals';
import { formatDateString } from 'src/utils/dates';
import { t } from '../../locale/labels';
import { Day } from '../../models/timeEntry';
import { getFormattedHours, getTotalPerWeek } from '../../utils/timesheet';
import { getIcon } from '../icons';

interface Props {
	days: Day[];
	from: Date;
	to: Date;
	templates?: Template[];
	onOpen: QRL;
}

export const TemplateRow = component$<Props>(({ days, from, to, templates, onOpen }) => {
	const isTemplateAvailable = (template: any, from: Date, to: Date) => {
		const dayStart = new Date(template.date_start);
		const dayEnd = new Date(template.date_end);
		/* CONDIZIONI DI BORDO DA DEFINIRE MEGLIO */
		/* const startDayOfWeek = dayStart.getDay();
		const endDayOfWeek = dayEnd.getDay();
	
		if (
			isInInterval(dayStart, from, to) &&
			startDayOfWeek >
				Math.max(
					...template.daytime.filter((item: number) => {
						item !== 0;
					})
				)
		) {
			return false;
		}
		if (
			isInInterval(dayEnd, from, to) &&
			endDayOfWeek <
				Math.min(
					...template.daytime.filter((item: number) => {
						item !== 0;
					})
				)
		) {
			return false;
		} */
		return intervalIntersect(dayStart, dayEnd, from, to);
	};

	return (
		<>
			{templates?.map((template) => {
				const id = template.id;
				if (isTemplateAvailable(template, from, to)) {
					return (
						<tr key={id} class='border-b bg-orange-50'>
							<th
								scope='row'
								class='whitespace-wrap border border-surface-50 px-6 py-4 text-left font-medium shadow-inset-leftBorder shadow-warning-dark'
							>
								<div class='flex flex-col'>
									<h4 class='text-sm font-normal text-darkgray-500'>
										{`${t('CLIENT')}: ${template.customer}`}
									</h4>
									<h4 class='text-base font-bold text-dark-grey'>
										{template.project?.name}
									</h4>
									{template.task && (
										<h4 class='text-dark-gray-900 text-sm font-normal'>
											{`${t('TASK')}: ${template.task.name}`}
										</h4>
									)}
								</div>
							</th>
							{days.map((day) => {
								const formattedDate = formatDateString(day.date);
								const dayOfWeek = day.date.getDay();
								return (
									<td
										key={`day-${formattedDate}`}
										class='relative border border-surface-50 px-4 py-3 text-center'
									>
										{template.daytime.includes(dayOfWeek) &&
										isInInterval(
											day.date,
											new Date(template.date_start),
											new Date(template.date_end)
										)
											? getFormattedHours(template.timehours)
											: ''}
									</td>
								);
							})}
							<td class='border border-surface-50 px-4 py-3 text-center'>
								<span class='text-base font-normal'>
									{getTotalPerWeek(template, days)}
								</span>
							</td>
							<td class='border border-surface-50 px-4 py-3 text-center'>
								<button
									onClick$={() => {
										onOpen(id);
									}}
								>
									{getIcon('Approve')}
								</button>
							</td>
						</tr>
					);
				}
			})}
		</>
	);
});
