import { Signal, component$, useComputed$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ReportTimeEntry } from '@models/report';
import { t } from 'src/locale/labels';
import {
	getReportBillableHours,
	getReportTotalHours,
	getTopCustomer,
	getTopProject,
} from 'src/utils/chart';
import { getFormattedHours } from 'src/utils/timesheet';
import { capitalizeString } from '../../utils/string';

interface ReportHeaderProps {
	customer?: Signal<Customer>;
	data: ReportTimeEntry[];
	showTopCustomer?: boolean;
	showTopProject?: boolean;
}

export const ReportHeader = component$<ReportHeaderProps>(
	({ customer, data, showTopCustomer = false, showTopProject = false }) => {
		const totalHours = useComputed$(() => {
			return getReportTotalHours(data);
		});

		const billableHours = useComputed$(() => {
			return getReportBillableHours(data);
		});

		const topProject = useComputed$(() => {
			if (!showTopProject) return;
			return getTopProject(data);
		});

		const topCustomer = useComputed$(() => {
			if (!showTopCustomer) return;
			return getTopCustomer(data);
		});

		return (
			<div class='flex flex-col gap-6'>
				{customer && <h3 class='font-bold text-base text-dark-grey'>{customer.value}</h3>}

				<div class='w-full flex flex-row gap-5 align-middle'>
					<h3 class='text-base font-normal text-dark-grey align-middle'>
						{t('TOTAL_TIME_LABEL')}:{' '}
						<span class='font-bold'>{getFormattedHours(totalHours.value)} h</span>
					</h3>

					{showTopProject && (
						<h3 class='text-base font-normal text-dark-grey align-middle'>
							{t('TOP_PROJECT_LABEL')}:{' '}
							<span class='font-bold'>{topProject.value}</span>
						</h3>
					)}

					{showTopCustomer && (
						<h3 class='text-base font-normal text-dark-grey align-middle'>
							{t('TOP_PROJECT_LABEL')}:{' '}
							<span class='font-bold'>{topCustomer.value}</span>
						</h3>
					)}

					{!(showTopCustomer || showTopProject) && (
						<h3 class='text-base font-normal text-dark-grey align-middle'>
							{capitalizeString(t('PROJECT_BILLABLE_LABEL'))}:
							<span class='font-bold'>
								{getFormattedHours(billableHours.value)} h
							</span>
						</h3>
					)}
				</div>
			</div>
		);
	}
);
