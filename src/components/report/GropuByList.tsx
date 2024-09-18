import { component$, Signal, useSignal } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';
import { useGroupList } from 'src/hooks/report/useGroupList';
import { t } from 'src/locale/labels';
import { getReportTotalHours } from 'src/utils/chart';
import { getFormattedHours } from 'src/utils/timesheet';
import { UUID } from 'src/utils/uuid';
import { Button } from '../Button';
import { Select } from '../form/Select';
import { getIcon } from '../icons';

interface GroupByListProps {
	data: Signal<ReportTimeEntry[]>;
	from: Signal<Date>;
	to: Signal<Date>;
}

export const GroupByList = component$<GroupByListProps>(({ data, from, to }) => {
	const {
		results,
		valueL1Selected,
		valueL2Selected,
		valueL3Selected,
		onChangeGroupL1,
		onChangeGroupL2,
		onChangeGroupL3,
		selectOptions,
		handlerDownloadCSV,
	} = useGroupList(data, from, to);

	const _selectOptions = useSignal(selectOptions);

	return (
		<div class='border-sourface-20 border-t py-3'>
			<div class='flex items-center gap-2 sm:flex-col md:flex-row md:justify-between lg:flex-row lg:justify-between'>
				<div class='flex items-center gap-2 sm:w-full sm:flex-col md:flex-auto md:flex-row lg:flex-auto lg:flex-row'>
					<span>{t('GROUP_BY_LABEL')}</span>

					<Select
						id={UUID()}
						value={valueL1Selected}
						options={_selectOptions}
						onChange$={onChangeGroupL1}
					/>

					<Select
						id={UUID()}
						value={valueL2Selected}
						options={_selectOptions}
						onChange$={onChangeGroupL2}
					/>

					{valueL2Selected.value != t('NONE_LABEL') && (
						<Select
							id={UUID()}
							value={valueL3Selected}
							options={_selectOptions}
							onChange$={onChangeGroupL3}
						/>
					)}
				</div>

				<div class='flex flex-none flex-row items-center gap-2'>
					<Button variant={'link'} onClick$={handlerDownloadCSV}>
						<span class='inline-flex items-start gap-1'>
							{getIcon('Download')} {t('REPORT_DOWNLOAD_CSV_LABEL')}
						</span>
					</Button>
				</div>
			</div>

			<div class='relative overflow-x-auto'>
				<table class='w-full text-left rtl:text-right'>
					<thead class='text-xs text-gray-700'>
						<tr>
							<th scope='col' class='flex-1 py-3 text-xs font-normal text-dark-grey'>
								{t('NAME_LABEL')}
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
							<td class='flex-1 pb-2'>
								{selectOptions[selectOptions.indexOf(valueL1Selected.value)]}
							</td>
							<td class='w-64 flex-auto pb-2 text-right'>
								{getFormattedHours(getReportTotalHours(data.value))} h
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
