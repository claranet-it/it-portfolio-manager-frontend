import { Signal, component$, useComputed$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ReportTimeEntry } from '@models/report';
import { t } from 'src/locale/labels';
import { getReportBillableHours, getReportTotalHours } from 'src/utils/chart';
import { getFormattedHours } from 'src/utils/timesheet';
import { capitalizeString } from '../../utils/string';

interface ReportHeaderProps {
	customer?: Signal<Customer>;
	data: ReportTimeEntry[];
}

export const ReportHeader = component$<ReportHeaderProps>(({ customer, data }) => {
	const totalHours = useComputed$(() => {
		return getReportTotalHours(data);
	});

	const billableHours = useComputed$(() => {
		return getReportBillableHours(data);
	});

	return (
		<div class='w-full flex flex-row gap-5 align-middle'>
			{customer && <h3 class='font-bold text-xl text-dark-grey'>{customer.value}</h3>}

			<h3 class='text-base font-normal text-dark-grey align-middle'>
				{t('total')}: <span class='font-bold'>{getFormattedHours(totalHours.value)} h</span>
			</h3>

			<h3 class='text-base font-normal text-dark-grey align-middle'>
				{capitalizeString(t('PROJECT_BILLABLE_LABEL'))}:
				<span class='font-bold'>{getFormattedHours(billableHours.value)} h</span>
			</h3>
		</div>
	);
});
