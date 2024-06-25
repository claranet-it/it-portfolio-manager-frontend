import { component$, useSignal } from '@builder.io/qwik';
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
		</div>
	);
});
