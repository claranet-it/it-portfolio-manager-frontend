import { $, component$, Signal, useSignal } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';
import { useGroupList } from 'src/hooks/report/useGroupList';
import { t } from 'src/locale/labels';
import { getReportTotalHours, getReportTotalPlannedHours } from 'src/utils/chart';
import { handlePrint } from 'src/utils/handlePrint';
import { getFormattedHours } from 'src/utils/timesheet';
import { UUID } from 'src/utils/uuid';
import { OptionDropdown } from '../form/OptionDropdown';
import { Select } from '../form/Select';
import { ToggleSwitch } from '../form/ToggleSwitch';
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
	const showPlannedHours = useSignal(false);
	const groupByRef = useSignal<HTMLElement>();

	return (
		<div ref={groupByRef} class='border-sourface-20 border-t py-3'>
			<div class='brickly-logo-pdf-download flex hidden justify-end'>
				<div class='px-6 py-4 sm:text-center [&_svg]:sm:inline'>
					{getIcon('BricklyRedLogo')}
				</div>
			</div>
			<div class='hide-on-pdf-download flex items-center gap-2 sm:flex-col md:flex-row md:justify-between lg:flex-row lg:justify-between'>
				<div class='flex items-center gap-2 sm:w-full sm:flex-col md:flex-auto md:flex-row lg:flex-auto lg:flex-row'>
					<span class='mr-4'>{t('GROUP_BY_LABEL')}</span>

					<Select
						id={UUID()}
						value={valueL1Selected}
						options={_selectOptions}
						onChange$={onChangeGroupL1}
						size='s'
					/>

					<Select
						id={UUID()}
						value={valueL2Selected}
						options={_selectOptions}
						onChange$={onChangeGroupL2}
						size='s'
					/>

					{valueL2Selected.value != t('NONE_LABEL') && (
						<Select
							id={UUID()}
							value={valueL3Selected}
							options={_selectOptions}
							onChange$={onChangeGroupL3}
							size='s'
						/>
					)}
				</div>

				<div
					data-tooltip-target='tooltip-planned-hours'
					class='hide-on-pdf-download flex flex-row gap-1'
				>
					<ToggleSwitch isChecked={showPlannedHours} label='Show Planned' />
					<div
						id='tooltip-planned-hours'
						role='tooltip'
						class='text-sx tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-700 px-3 py-2 font-normal text-white opacity-0 shadow-sm transition-opacity duration-300'
					>
						{t('PLANNED_HOURS_DESCRIPTION')}
						<div class='tooltip-arrow' data-popper-arrow></div>
					</div>
				</div>

				<div class='flex flex-none flex-row items-center gap-2'>
					<OptionDropdown
						id='download-dropdown-groupby'
						icon={getIcon('Download')}
						label={t('REPORT_DOWNLOAD_LABEL')}
						options={[
							{
								value: t('CSV_LABEL'),
								onChange: handlerDownloadCSV,
							},
							{
								value: t('PDF_LABEL'),
								onChange: $(() => handlePrint(groupByRef)),
							},
						]}
					/>
				</div>
			</div>

			<div class='relative overflow-x-auto'>
				<table class='w-full text-left rtl:text-right'>
					<thead class='text-xs text-gray-700'>
						<tr>
							<th scope='col' class='flex-1 py-3 text-xs font-normal text-dark-grey'>
								{t('NAME_LABEL')}
							</th>
							{showPlannedHours.value && (
								<th
									scope='col'
									class='w-64 flex-auto py-3 text-right text-xs font-normal text-dark-grey'
								>
									{t('PLANNED_HOURS_LABEL')}
								</th>
							)}
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
							{showPlannedHours.value && (
								<td class='w-64 flex-auto pb-2 text-right'>
									{getFormattedHours(getReportTotalPlannedHours(data.value))} h
								</td>
							)}
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
									{showPlannedHours.value && (
										<td class='w-64 flex-auto py-4 text-right text-base'>
											{getFormattedHours(row.plannedHours)} h
										</td>
									)}
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
											{showPlannedHours.value && (
												<td class='w-64 flex-auto py-4 text-right text-base'>
													{getFormattedHours(level2Row.plannedHours)} h
												</td>
											)}
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
												{showPlannedHours.value && (
													<td class='w-64 flex-auto py-4 text-right text-base'>
														{getFormattedHours(level23Row.plannedHours)}{' '}
														h
													</td>
												)}
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
