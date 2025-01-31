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

				<table class='effort-table-min-w table-left-sticky w-full text-left text-sm rtl:text-right'>
					{/** Table header */}
					<thead class='bg-surface-20 text-xs text-gray-700'>
						<tr class='border-b border-t border-surface-50'>
							<th
								scope='col'
								class='content-start border-l border-r border-surface-50 bg-surface-20 px-4 py-3 text-base font-bold text-darkgray-900'
							>
								{t('average')}
							</th>
							{Object.keys(averageEffortByMonth.value).map((monthYear, index) => (
								<th
									key={`${index}_${monthYear}`}
									scope='col'
									class='border-l border-r border-surface-50 px-4 py-3 font-normal'
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
													class='block w-full rounded-md border border-darkgray-500 bg-surface-20 p-2.5 text-sm text-gray-900'
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
													class='block w-full rounded-md border border-darkgray-500 bg-surface-20 p-2.5 text-sm text-gray-900'
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
														' block w-full rounded-md border border-darkgray-500 p-2.5 text-sm text-gray-900'
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
									class='border-b border-t border-surface-50 bg-white odd:bg-white even:bg-surface-5'
								>
									<td class='content-start border-l border-r border-surface-50 px-4 py-3'>
										<div class='flow-col'>
											<h3 class='text-xl font-bold text-dark-grey'>
												{data.isCompany && (
													<span class='mr-1 inline-block -translate-y-0.5 align-middle'>
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
									{effort.map((month, effortKey) => (
										<td
											class='border-l border-r border-surface-50 px-4 py-3'
											key={effortKey}
										>
											<div class='grid grid-cols-2 gap-2'>
												<form
													key={`confirmed_${month.confirmedEffort}_${uid}`}
													class='max-w min-w-16'
												>
													<label
														class='text-sm font-normal'
														for={'confirmed_' + effortKey}
													>
														{t('effort_table_confirmed')}
													</label>
													<input
														disabled={data.isCompany}
														type='number'
														id={'confirmed' + effortKey}
														class={
															'block w-full rounded-md border border-darkgray-500 p-2.5 text-sm text-gray-900'
														}
														value={month.confirmedEffort}
														onChange$={async (event, { value }) => {
															const confirmedEffortValue = parseInt(
																value,
																10
															);
															const fallbackTentativeEffort =
																100 - confirmedEffortValue;
															if (
																fallbackTentativeEffort <
																month.tentativeEffort
															) {
																month.tentativeEffort =
																	fallbackTentativeEffort;
															}
															const result = await updateEffortField(
																uid,
																{
																	...month,
																	confirmedEffort:
																		confirmedEffortValue,
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

												<form
													key={`tentative_${month.tentativeEffort}_${uid}`}
													class='max-w min-w-16'
												>
													<label
														class='text-sm font-normal'
														for={'tentative_' + effortKey}
													>
														{t('effort_table_tentative')}
													</label>
													<input
														disabled={data.isCompany}
														type='number'
														id={'tentative_' + effortKey}
														class={
															'block w-full rounded-md border border-darkgray-500 p-2.5 text-sm text-gray-900'
														}
														value={month.tentativeEffort}
														onChange$={async (event, { value }) => {
															const confirmedTentativeEffort =
																parseInt(value, 10);
															const fallbackConfirmedEffort =
																100 - confirmedTentativeEffort;
															if (
																fallbackConfirmedEffort <
																month.confirmedEffort
															) {
																month.confirmedEffort =
																	fallbackConfirmedEffort;
															}
															const result = await updateEffortField(
																uid,
																{
																	...month,
																	tentativeEffort:
																		confirmedTentativeEffort,
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
														<form
															key={`table_note_${month.notes.length}_${uid}`}
															class='w-full'
														>
															<label
																class='text-sm font-normal'
																for={'note_' + effortKey}
															>
																{t('effort_table_note')}
															</label>
															<input
																type='string'
																id={'note_' + effortKey}
																placeholder={t(
																	'effort_table_in_note'
																)}
																class={
																	'block w-full rounded-md border border-darkgray-500 p-2.5 text-sm text-gray-900'
																}
																value={month.notes}
																onChange$={async (
																	event,
																	{ value }
																) => {
																	const result =
																		await updateEffortField(
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
