import { $, Signal, component$, useSignal } from '@builder.io/qwik';
import { t } from '../locale/labels';
import { getDateLabelFromMonthYear } from '../utils/dates';
import { Month } from '@models/month';
import { putEffort, getEffort } from '../services/effort';
import { useNotification } from '../hooks/useNotification';
import { EffortMatrix } from '@models/Effort';

interface EffortTableInterface {
	averageEffortByMonth: Readonly<
		Signal<
			Record<
				string,
				{
					confirmed: number;
					tentative: number;
					total: number;
				}
			>
		>
	>;
	filteredEffort: Readonly<Signal<EffortMatrix>>;
}

const getColor = (effort: number) => {
	if (effort >= 80) return 'bg-green-100';
	if (effort >= 50) return 'bg-surface-20';
	return 'bg-clara-red-50';
};

export const EffortTable = component$<EffortTableInterface>(
	({ averageEffortByMonth, filteredEffort }) => {
		const { addEvent } = useNotification();

		const effortSig = useSignal<EffortMatrix>([]);

		const updateEffortField = $(
			async (
				uid: string,
				month: Month,
				data: {
					company: string;
					crew: string;
					name: string;
				}
			) => {
				try {
					await putEffort(uid, data, month);
					addEvent({
						message: t('EFFORT_SUCCESSFULLY_UPDATED'),
						type: 'success',
						autoclose: true,
					});
				} catch (error) {
					const { message } = error as Error;
					addEvent({
						message: message,
						type: 'danger',
					});
				}
				effortSig.value = await getEffort();
			}
		);

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
															.confirmed
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
															.tentative
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
																.total
														) +
														' border border-darkgray-500 text-gray-900 text-sm rounded-md block w-full p-2.5'
													}
													value={
														averageEffortByMonth.value[monthYear].total
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
						{filteredEffort.value.map((item, key) => {
							const [[uid, { effort, ...data }]] = Object.entries(item);
							return (
								<tr
									key={key}
									class='bg-white border-b border-t border-surface-50 even:bg-surface-5 odd:bg-white'
								>
									<td class='px-4 py-3 border-r border-l border-surface-50 content-start'>
										<div class='flow-col'>
											<h3 class='text-xl font-bold text-dark-gray'>
												{data.name}
											</h3>
											<p class='text-sm font-normal text-darkgray-900'>
												{data.crew}
											</p>
										</div>
									</td>
									{effort.map((month, key) => (
										<td
											class='px-4 py-3 border-r border-l border-surface-50'
											key={key}
										>
											<div class='grid grid-cols-2 gap-2'>
												<form class='max-w min-w-16'>
													<label
														class='text-sm font-normal'
														for={'confirmed_' + key}
													>
														{t('effort_table_confirmed')}
													</label>
													<input
														type='number'
														id={'confirmed' + key}
														class={
															'border border-darkgray-500 text-gray-900 text-sm rounded-md block w-full p-2.5'
														}
														value={month.confirmedEffort}
														onChange$={(_, { value }) => {
															updateEffortField(
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
														}}
													/>
												</form>

												<form class='max-w min-w-16'>
													<label
														class='text-sm font-normal'
														for={'tentative_' + key}
													>
														{t('effort_table_tentative')}
													</label>
													<input
														type='number'
														id={'tentative_' + key}
														class={
															'border border-darkgray-500 text-gray-900 text-sm rounded-md block w-full p-2.5'
														}
														value={month.tentativeEffort}
														onChange$={(_, { value }) => {
															updateEffortField(
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
														}}
													/>
												</form>

												<div class='col-span-2'>
													<form class='w-full'>
														<label
															class='text-sm font-normal'
															for={'note_' + key}
														>
															{t('effort_table_note')}
														</label>
														<input
															type='string'
															id={'note_' + key}
															placeholder={t('effort_table_in_note')}
															class={
																'border border-darkgray-500 text-gray-900 text-sm rounded-md block w-full p-2.5'
															}
															value={month.notes}
															onChange$={(_, { value }) => {
																console.log(value);
																updateEffortField(
																	uid,
																	{ ...month, notes: value },
																	data
																);
															}}
														/>
													</form>
												</div>
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
