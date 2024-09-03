import { component$, Signal, useSignal } from '@builder.io/qwik';
import { Project } from '@models/project';
import { ReportTimeEntry } from '@models/report';
import { useGroupList } from 'src/hooks/report/useGroupList';
import { t } from 'src/locale/labels';
import { getReportTotalHours } from 'src/utils/chart';
import { getFormattedHours } from 'src/utils/timesheet';
import { UUID } from 'src/utils/uuid';
import { Select } from '../form/Select';

interface GroupByListProps {
	project: Signal<Project>;
	data: ReportTimeEntry[];
}

export const GroupByList = component$<GroupByListProps>(({ project, data }) => {
	const {
		results,
		valueL1Selected,
		valueL2Selected,
		valueL3Selected,
		onChangeGroupL1,
		onChangeGroupL2,
		onChangeGroupL3,
		selectOptions,
	} = useGroupList(project, data);

	return (
		<div class='border-sourface-20 border-t py-3'>
			<div class='flex flex-row items-center gap-2'>
				<span>{t('GROUP_BY_LABEL')}</span>

				<Select
					id={UUID()}
					value={valueL1Selected}
					options={useSignal(selectOptions)}
					onChange$={onChangeGroupL1}
				/>

				<Select
					id={UUID()}
					value={valueL2Selected}
					options={useSignal(selectOptions)}
					onChange$={onChangeGroupL2}
				/>

				{valueL2Selected.value != t('NONE_LABEL') && (
					<Select
						id={UUID()}
						value={valueL3Selected}
						options={useSignal(selectOptions)}
						onChange$={onChangeGroupL3}
					/>
				)}
			</div>

			<div class='relative overflow-x-auto'>
				<table class='w-full text-left rtl:text-right'>
					<thead class='text-xs text-gray-700'>
						<tr>
							<th scope='col' class='flex-1 py-3 text-xs font-normal text-dark-grey'>
								{t('PROJECT_LABEL')}
							</th>
							<th
								scope='col'
								class='w-64 flex-auto py-3 text-right text-xs font-normal text-dark-grey'
							>
								{t('DURATION_LABEL')}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr class='border-b bg-white text-base font-bold text-dark-grey'>
							<td class='flex-1 pb-2'>{project.value.name}</td>
							<td class='w-64 flex-auto pb-2 text-right'>
								{getFormattedHours(getReportTotalHours(data))} h
							</td>
						</tr>
						{/* GROUP BY L1 */}
						{results.value.map((row) => (
							<>
								<tr class='bg-white'>
									<td class='flex-1 py-4 pl-4 text-base'>
										{row.key !== '' ? row.key : t('EMPTY_LABEL')}
									</td>
									<td class='w-64 flex-auto py-4 text-right text-base'>
										{getFormattedHours(row.duration)} h
									</td>
								</tr>
								{/* GROUP BY L2 */}
								{row.subGroups?.map((level2Row) => (
									<>
										<tr class='bg-white'>
											<td class='flex-1 py-1 pl-12 text-base'>
												{level2Row.key !== ''
													? level2Row.key
													: t('EMPTY_LABEL')}
											</td>
											<td class='w-64 flex-auto py-1 text-right text-base'>
												{getFormattedHours(level2Row.duration)} h
											</td>
										</tr>
										{/* GROUP BY L3 */}
										{level2Row.subGroups?.map((level23Row) => (
											<tr class='bg-white'>
												<td class='flex-1 py-1 pl-20 text-base'>
													{level23Row.key !== ''
														? level23Row.key
														: t('EMPTY_LABEL')}
												</td>
												<td class='w-64 flex-auto py-1 text-right text-base'>
													{getFormattedHours(level23Row.duration)} h
												</td>
											</tr>
										))}
									</>
								))}
							</>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
});
