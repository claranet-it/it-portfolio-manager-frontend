import { component$, useSignal } from '@builder.io/qwik';
import { DataRange } from 'src/components/form/DataRange';
import { ProductivityTable } from 'src/components/report/ProductivityTable';
import { ReportFilters } from 'src/components/report/ReportFilters';
import { useProductivity } from 'src/hooks/report/useProductivity';
import { useGetTimeSheetDays } from 'src/hooks/timesheet/useGetTimeSheetDays';
import { t } from 'src/locale/labels';

export const Report = component$(() => {
	const { from, to, nextWeek, prevWeek } = useGetTimeSheetDays();

	const selectedCustomerSig = useSignal<string>('');
	const selectedProjectSig = useSignal<string>('');
	const selectedTaskSig = useSignal<string>('');
	const selectedNameSig = useSignal<string>('');

	const { results } = useProductivity(
		selectedCustomerSig,
		selectedProjectSig,
		selectedTaskSig,
		selectedNameSig,
		from,
		to
	);

	return (
		<div class='w-full px-3 pt-2.5 space-y-6'>
			<div class='flex sm:flex-col md:flex-row lg:flex-row item-right gap-2'>
				<ReportFilters
					selectedCustomer={selectedCustomerSig}
					selectedProject={selectedProjectSig}
					selectedTask={selectedTaskSig}
					selectedName={selectedNameSig}
				/>

				<DataRange from={from} to={to} nextAction={nextWeek} prevAction={prevWeek} />
			</div>

			{/* TAB Selection */}
			<div class='flex flex-col space-y-3'>
				<div class='border-b border-surface-70'>
					<ul
						class='flex flex-wrap -mb-px text-sm text-center'
						id='default-tab'
						data-tabs-toggle='#report-tab-content'
						role='tablist'
						data-tabs-active-classes='text-dark-grey border-dark-grey'
						data-tabs-inactive-classes='text-dark-grey'
					>
						<li class='me-2' role='productivity'>
							<button
								class='inline-block p-4 border-b-2 text-dark-grey hover:border-dark-grey'
								id='productivity-tab'
								data-tabs-target='#productivity'
								type='button'
								role='tab'
								aria-controls='productivity'
								aria-selected='false'
							>
								{t('PRODUCTIVITY_LABEL')}
							</button>
						</li>
					</ul>
				</div>
				<div id='report-tab-content' class='border border-surface-70 p-6'>
					<div
						class='hidden flex flex-col  gap-6'
						id='productivity'
						role='tabpanel'
						aria-labelledby='productivity-tab'
					>
						<ProductivityLegend />

						<ProductivityTable results={results} />
					</div>
				</div>
			</div>
		</div>
	);
});

const ProductivityLegend = component$(() => {
	return (
		<div class='flex flex-row'>
			<div class='flex sm:flex-col md:flex-row lg:flex-row text-dark-grey'>
				<h3 class=' font-bold text-base me-6'>{t('LEGEND_USERS_ACTIVITIES')}</h3>

				<span class='flex items-center text-xs font-normal text-dark-grey me-1'>
					{t('LEGEND_LABEL').toUpperCase()}
				</span>

				<span class='flex items-center text-xs font-normal text-dark-grey me-3'>
					<span class='flex w-2.5 h-2.5 bg-green-500 rounded-full me-1.5 flex-shrink-0'></span>
					{t('PRODUCTIVILY_BILLABLE_LABEL')}
				</span>
				<span class='flex items-center text-xs font-normal text-dark-grey me-3'>
					<span class='flex w-2.5 h-2.5 bg-green-200 rounded-full me-1.5 flex-shrink-0'></span>
					{t('PRODUCTIVITY_NOT_BILLABLE_LABEL')}
				</span>
				<span class='flex items-center text-xs font-normal text-dark-grey me-3'>
					<span class='flex w-2.5 h-2.5 bg-yellow-100 rounded-full me-1.5 flex-shrink-0'></span>
					{t('PRODUCTIVITY_SLACK_TIME_LABEL')}
				</span>
				<span class='flex items-center text-xs font-normal text-dark-grey me-3'>
					<span class='flex w-2.5 h-2.5 bg-pink-1 rounded-full me-1.5 flex-shrink-0'></span>
					{t('PRODUCTIVITY_ABSENCE_LABEL')}
				</span>
			</div>
		</div>
	);
});
