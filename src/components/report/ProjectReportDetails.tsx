import { component$, Signal, useComputed$ } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';
import { t } from 'src/locale/labels';
import {
	columnChartSeriesAdapter,
	donutChartGroupByProjectsAdapter,
	listGroupByProjectsAdapter,
} from 'src/utils/chart';
import { REPORT_LIST_RESULTS_PER_PAGE } from 'src/utils/constants';
import { ColumnChart } from '../charts/ColumnChart';
import { DonutChart } from '../charts/DonutChart';
import { ReportList } from './ReportList';

interface ProjectReportDetailsProps {
	data: ReportTimeEntry[];
	from: Signal<Date>;
	to: Signal<Date>;
}

export const ProjectReportDetails = component$<ProjectReportDetailsProps>(({ data, from, to }) => {
	const daysSeries = useComputed$(() => {
		return columnChartSeriesAdapter(data, from.value, to.value);
	});

	const groupByProjectSeries = useComputed$(() => {
		return donutChartGroupByProjectsAdapter(data);
	});

	const listGroupByProjectSeries = useComputed$(() => {
		return listGroupByProjectsAdapter(data);
	});

	return (
		<div class='flex flex-col p-3 divide-y divide-surface-70'>
			<ColumnChart data={daysSeries} />

			<div class='flex sm:flex-col md:flex-row lg:flex-row py-6 md:justify-between lg:justify-between gap-1'>
				<div class='flex-none'>
					<h3 class='text-xl font-bold text-dark-grey'>{t('PROJECT_LABEL')}</h3>
				</div>

				<div class='flex-1 items-center text-center'>
					<div class='max-w-lg'>
						<DonutChart data={groupByProjectSeries} />
					</div>
				</div>

				<div class='sm:w-full flex-1 '>
					<ReportList
						data={listGroupByProjectSeries}
						resultsPerPage={REPORT_LIST_RESULTS_PER_PAGE}
					/>
				</div>
			</div>
		</div>
	);
});
