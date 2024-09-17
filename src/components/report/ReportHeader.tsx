import { $, Signal, component$, useComputed$, useContext } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ReportTimeEntry } from '@models/report';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';

import {
	getReportBillableHours,
	getReportTotalHours,
	getTopCustomer,
	getTopProject,
} from 'src/utils/chart';
import { openDownloadCSVDialog } from 'src/utils/csv';
import { formatDateString } from 'src/utils/dates';
import { handlePrint } from 'src/utils/handlePrint';
import { getReportCSV } from 'src/utils/report';
import { getFormattedHours } from 'src/utils/timesheet';
import { CSV_REPORT_PROJECTS_FILE_NAME } from '../../utils/constants';
import { capitalizeString } from '../../utils/string';
import { Button } from '../Button';
import { getIcon } from '../icons';

interface ReportHeaderProps {
	customer?: Signal<Customer[]>;
	data: ReportTimeEntry[];
	showTopCustomer?: boolean;
	showTopProject?: boolean;
	printableComponent: Signal<HTMLElement | undefined>;
	from?: Signal<Date>;
	to?: Signal<Date>;
}

export const ReportHeader = component$<ReportHeaderProps>(
	({ data, showTopCustomer = false, showTopProject = false, printableComponent, from, to }) => {
		const appStore = useContext(AppContext);

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

		const downloadCSV = $(async () => {
			if (from && to) {
				appStore.isLoading = true;
				const CSV = await getReportCSV(data);
				openDownloadCSVDialog(
					CSV,
					`${CSV_REPORT_PROJECTS_FILE_NAME}_${formatDateString(from.value)}_${formatDateString(to.value)}`
				);
				appStore.isLoading = false;
			}
		});

		return (
			<div class='flex flex-col gap-6'>
				<h3 class='text-base font-bold text-dark-grey'>
					{t('TIMESHEET_TABLE_PROJECT_COL_LABEL')}
				</h3>

				<div class='flex w-full flex-row justify-between align-middle'>
					<div class='flex flex-row items-center gap-5'>
						<h3 class='align-middle text-base font-normal text-dark-grey'>
							{t('TOTAL_TIME_LABEL')}:{' '}
							<span class='font-bold'>{getFormattedHours(totalHours.value)} h</span>
						</h3>

						{showTopProject && (
							<h3 class='align-middle text-base font-normal text-dark-grey'>
								{t('TOP_PROJECT_LABEL')}:{' '}
								<span class='font-bold'>{topProject.value}</span>
							</h3>
						)}

						{showTopCustomer && (
							<h3 class='align-middle text-base font-normal text-dark-grey'>
								{t('TOP_CUSTOMER_LABEL')}:{' '}
								<span class='font-bold'>{topCustomer.value}</span>
							</h3>
						)}

						{!(showTopCustomer || showTopProject) && (
							<h3 class='align-middle text-base font-normal text-dark-grey'>
								{capitalizeString(t('PROJECT_BILLABLE_LABEL'))}:
								<span class='font-bold'>
									{getFormattedHours(billableHours.value)} h
								</span>
							</h3>
						)}
					</div>

					<div class='flex flex-row items-center'>
						<Button variant={'link'} onClick$={() => handlePrint(printableComponent)}>
							<span class='inline-flex items-start gap-1'>
								{getIcon('Download')} {t('REPORT_DOWNLOAD_PDF_LABEL')}
							</span>
						</Button>

						<Button variant={'link'} onClick$={downloadCSV}>
							<span class='inline-flex items-start gap-1'>
								{getIcon('Downlaod')} {t('REPORT_DOWNLOAD_CSV_LABEL')}
							</span>
						</Button>
					</div>
				</div>
			</div>
		);
	}
);
