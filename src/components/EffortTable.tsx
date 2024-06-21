import { $, QRL, Signal, component$ } from '@builder.io/qwik';
import { EffortMatrix } from '@models/effort';
import { Month } from '@models/month';
import { getDateLabelFromMonthYear } from 'src/utils/dates';
import { t } from '../locale/labels';
import { getIcon } from './icons';

interface EffortTableInterface {
	averageEffortByMonth: Readonly<
		Signal<Record<string, Omit<Month, 'people' | 'notes' | 'month_year'>>>
	>;
	filteredEffort: Readonly<Signal<EffortMatrix>>;
	updateEffortField: QRL;
}

const getColor = (effort: number) => {
	if (effort >= 80) return 'bg-green-100';
	if (effort >= 50) return 'bg-surface-20';
	return 'bg-clara-red-50';
};

const fallbackValue = $((event: Event, oldValue: string) => {
	const element = event.target as HTMLInputElement;
	element.value = oldValue;
});

export const EffortTable = component$<EffortTableInterface>(
	({ averageEffortByMonth, filteredEffort, updateEffortField }) => {
		return (
			<div class='space-y-1'>
				<h1 class='text-2xl font-bold text-darkgray-900'>{t('effort_table_title')}</h1>

				<table class='w-full effort-table-min-w text-sm text-left rtl:text-right'>
					{/** Table header */}
					<thead class='text-xs text-gray-700 bg-surface-20'>
						<tr class='border-t border-b border-surface-50'>
							<th
								scope='col'
								class='text-base font-bold text-darkgray-900 content-start px-4 py-3 border-r border-l border-surface-50 bg-surface-20'
							>
								{t('average')}
							</th>
							{Object.keys(averageEffortByMonth.value).map((monthYear, index) => (
								<th
									key={index}
									scope='col'
									class='font-normal px-4 py-3 border-r border-l border-surface-50'
								>
									<div class='flow-col space-y-1'>
										<h3 class='text-base font-bold text-darkgray-900'>
											{getDateLabelFromMonthYear(monthYear)}
										</h3>

										<div class='grid grid-cols-3 gap-2'>
											<form class='max-w min-w-16'>
												<label
													class='text-sm font-normal'
													for={'confirmed_' + index}
												>
													{t('effort_table_confirmed')}
												</label>
												<input
													type='number'
													id={'confirmed' + index}
													class='bg-surface-20 border border-darkgray-500 text-gray-900 text-sm rounded-md block w-full p-2.5'
													value={
														averageEffortByMonth.value[monthYear]
															.confirmedEffort
													}
													disabled
												/>
											</form>

											<form class='max-w min-w-16'>
												<label
													class='text-sm font-normal'
													for={'tentative_' + index}
												>
													{t('effort_table_tentative')}
												</label>
												<input
													type='number'
													id={'tentative' + index}
													class='bg-surface-20 border border-darkgray-500 text-gray-900 text-sm rounded-md block w-full p-2.5'
													value={
														averageEffortByMonth.value[monthYear]
															.tentativeEffort
													}
													disabled
												/>
											</form>

											<form class='max-w min-w-16'>
												<label
													class='text-sm font-normal'
													for={'total_' + index}
												>
													{t('effort_table_total')}
												</label>
												<input
													type='number'
													id={'total' + index}
													class={
														getColor(
															averageEffortByMonth.value[monthYear]
																.totalEffort ?? 0
														) +
														' border border-darkgray-500 text-gray-900 text-sm rounded-md block w-full p-2.5'
													}
													value={
														averageEffortByMonth.value[monthYear]
															.totalEffort
													}
													disabled
												/>
											</form>
										</div>
									</div>
								</th>
							))}
						</tr>
					</thead>

					{/* Table body */}
					<tbody>
						{filteredEffort.value.map((item, userKey) => {
							const [[uid, { effort, ...data }]] = Object.entries(item);
							return (
								<tr
									key={userKey}
									class='bg-white border-b border-t border-surface-50 even:bg-surface-5 odd:bg-white'
								>
									<td class='px-4 py-3 border-r border-l border-surface-50 content-start'>
										<div class='flow-col'>
											<h3 class='text-xl font-bold text-dark-grey'>
												{data.isCompany && (
													<span class='inline-block mr-1 align-middle -translate-y-0.5'>
														{data.isCompany && getIcon('UserGroup')}
													</span>
												)}
												{data.name}
											</h3>
											<p class='text-sm font-normal text-darkgray-900'>
												{data.isCompany ? data.skill : data.crew}
											</p>
										</div>
									</td>
									{effort.map((month, efforKey) => (
										<td
											class='px-4 py-3 border-r border-l border-surface-50'
											key={efforKey}
										>
											<div class='grid grid-cols-2 gap-2'>
												<form class='max-w min-w-16'>
													<label
														class='text-sm font-normal'
														for={'confirmed_' + efforKey}
													>
														{t('effort_table_confirmed')}
													</label>
													<input
														disabled={data.isCompany}
														type='number'
														id={'confirmed' + efforKey}
														class={
															'border border-darkgray-500 text-gray-900 text-sm rounded-md block w-full p-2.5'
														}
														value={month.confirmedEffort}
														onChange$={async (event, { value }) => {
															const result = await updateEffortField(
																userKey,
																efforKey,
																uid,
																{
																	...month,
																	confirmedEffort: parseInt(
																		value,
																		10
																	),
																},
																data
															);
															!result &&
																fallbackValue(
																	event,
																	month.confirmedEffort.toString()
																);
														}}
													/>
												</form>

												<form class='max-w min-w-16'>
													<label
														class='text-sm font-normal'
														for={'tentative_' + efforKey}
													>
														{t('effort_table_tentative')}
													</label>
													<input
														disabled={data.isCompany}
														type='number'
														id={'tentative_' + efforKey}
														class={
															'border border-darkgray-500 text-gray-900 text-sm rounded-md block w-full p-2.5'
														}
														value={month.tentativeEffort}
														onChange$={async (event, { value }) => {
															const result = await updateEffortField(
																userKey,
																efforKey,
																uid,
																{
																	...month,
																	tentativeEffort: parseInt(
																		value,
																		10
																	),
																},
																data
															);
															!result &&
																fallbackValue(
																	event,
																	month.tentativeEffort.toString()
																);
														}}
													/>
												</form>

												{!data.isCompany && (
													<div class='col-span-2'>
														<form class='w-full'>
															<label
																class='text-sm font-normal'
																for={'note_' + efforKey}
															>
																{t('effort_table_note')}
															</label>
															<input
																type='string'
																id={'note_' + efforKey}
																placeholder={t(
																	'effort_table_in_note'
																)}
																class={
																	'border border-darkgray-500 text-gray-900 text-sm rounded-md block w-full p-2.5'
																}
																value={month.notes}
																onChange$={(event, { value }) => {
																	const result =
																		updateEffortField(
																			userKey,
																			efforKey,
																			uid,
																			{
																				...month,
																				notes: value,
																			},
																			data
																		);
																	!result &&
																		fallbackValue(
																			event,
																			month.notes
																		);
																}}
															/>
														</form>
													</div>
												)}
											</div>
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
);
