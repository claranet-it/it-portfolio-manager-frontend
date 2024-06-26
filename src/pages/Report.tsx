import { component$, useSignal } from '@builder.io/qwik';
import { ProductivityTable } from 'src/components/ProductivityTable';
import { ReportFilters } from 'src/components/ReportFilters';
import { DataRange } from 'src/components/form/DataRange';
import { useGetTimeSheetDays } from 'src/hooks/timesheet/useGetTimeSheetDays';

export const Report = component$(() => {
	const { from, to, nextWeek, prevWeek } = useGetTimeSheetDays();

	const selectedCustomerSig = useSignal<string>('');
	const selectedProjectSig = useSignal<string>('');
	const selectedTaskSig = useSignal<string>('');
	const selectedNameSig = useSignal<string>('');

	return (
		<div class='w-full px-3 pt-2.5 space-y-6'>
			<div class='flex flex-row item-right'>
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
								Productivity
							</button>
						</li>
					</ul>
				</div>
				<div id='report-tab-content' class='border border-surface-70 p-6'>
					<div
						class='hidden'
						id='productivity'
						role='tabpanel'
						aria-labelledby='productivity-tab'
					>
						<ProductivityTable />
					</div>
				</div>
			</div>
		</div>
	);
});
