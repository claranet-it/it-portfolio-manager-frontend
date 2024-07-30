import { component$, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { Button } from 'src/components/Button';
import { DataRange } from 'src/components/form/DataRange';
import { getIcon } from 'src/components/icons';
import { ProductivityLegend } from 'src/components/report/ProductivityLegend';
import { ProductivityTable } from 'src/components/report/ProductivityTable';
import { ReportFilters } from 'src/components/report/ReportFilters';
import { useProductivity } from 'src/hooks/report/useProductivity';
import { useGetTimeSheetDays } from 'src/hooks/timesheet/useGetTimeSheetDays';
import { t } from 'src/locale/labels';
import { handlePrint } from 'src/utils/handlePrint';

export const Report = component$(() => {
	const { from, to, nextWeek, prevWeek } = useGetTimeSheetDays();

	const selectedCustomerSig = useSignal<Customer>('');
	const selectedProjectSig = useSignal<Project>({ name: '', type: '' });
	const selectedTaskSig = useSignal<Task>('');
	const selectedNameSig = useSignal<string>('');
	const ref = useSignal<HTMLElement>();

	const { results } = useProductivity(
		selectedCustomerSig,
		selectedProjectSig,
		selectedTaskSig,
		selectedNameSig,
		from,
		to
	);

	return (
		<div class='w-full px-6 pt-2.5 space-y-6'>
			<div class='flex sm:flex-col md:flex-row lg:flex-row item-right gap-2'>
				<h1 class='text-2xl font-bold text-darkgray-900 me-4'>{t('REPORT_PAGE_TITLE')}</h1>

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
						<div class='flex sm:flex-col md:flex-row lg:flex-row md:justify-between lg:justify-between'>
							<ProductivityLegend />
							<Button variant={'link'} onClick$={() => handlePrint(ref)}>
								<span class='inline-flex items-end gap-1'>
									{getIcon('Downlaod')} Download report
								</span>
							</Button>
						</div>
						<ProductivityTable results={results} ref={ref} />
					</div>
				</div>
			</div>
		</div>
	);
});
