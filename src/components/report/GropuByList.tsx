import { $, component$, Signal, useComputed$, useSignal } from '@builder.io/qwik';
import { Project } from '@models/project';
import { GroupByKeys, ReportTimeEntry } from '@models/report';
import { t } from 'src/locale/labels';
import { getReportTotalHours, groupBy } from 'src/utils/chart';
import { getFormattedHours } from 'src/utils/timesheet';
import { UUID } from 'src/utils/uuid';
import { Select } from '../form/Select';

interface GroupByListProps {
	project: Signal<Project>;
	data: ReportTimeEntry[];
}

export const GroupByList = component$<GroupByListProps>(({ project, data }) => {
	const groupKeys = useSignal(['project', 'task', 'name', 'date', 'description', '']);

	const selectOptions = useSignal([
		t('PROJECT_LABEL'),
		t('TASK_LABEL'),
		t('USER_LABEL'),
		t('DATE_LABEL'),
		t('DESCRIPTION_LABEL'),
		'',
	]);

	const valueSelected = useSignal<string>(t('TASK_LABEL'));
	const valueSelectedValue = useSignal<GroupByKeys>('task');

	const groupedBy = useComputed$(() => {
		return groupBy(data, valueSelectedValue.value);
	});

	const onChangeGroup = $(() => {
		const index = selectOptions.value.indexOf(valueSelected.value);
		valueSelectedValue.value = groupKeys.value[index] as GroupByKeys;
	});

	return (
		<div class='border-t border-sourface-20 py-3'>
			<div class='flex flex-row gap-2 items-center'>
				<span>{t('GROUP_BY_LABEL')}</span>
				<Select
					id={UUID()}
					value={valueSelected}
					options={selectOptions}
					onChange$={onChangeGroup}
				/>
			</div>

			<div class='relative overflow-x-auto'>
				<table class='w-full text-left rtl:text-right '>
					<thead class='text-xs text-gray-700'>
						<tr>
							<th scope='col' class='py-3 flex-1 text-xs  text-dark-grey font-normal'>
								{t('PROJECT_LABEL')}
							</th>
							<th
								scope='col'
								class='py-3 flex-auto w-64 text-right text-xs  text-dark-grey font-normal'
							>
								{t('DURATION_LABEL')}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr class='bg-white border-b text-base font-bold text-dark-grey'>
							<td class='py-4 flex-1'>{project.value.name}</td>
							<td class='py-4 flex-auto w-64 text-right'>
								{getFormattedHours(getReportTotalHours(data))} h
							</td>
						</tr>
						{groupedBy.value.map((row) => (
							<tr class='bg-white'>
								<td class='py-4 flex-1 text-base'>{row.title}</td>
								<td class='py-4 flex-auto w-64 text-right text-base'>
									{getFormattedHours(row.duration)} h
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
});
