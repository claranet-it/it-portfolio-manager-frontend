import { component$, Signal, useComputed$ } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';
import {
	columnChartSeriesAdapter,
	donutChartGroupByProjectsAdapter,
	listGroupByProjectsAdapter,
} from 'src/utils/chart';
import { REPORT_LIST_RESULTS_PER_PAGE } from 'src/utils/constants';
import { ColumnChart } from '../charts/ColumnChart';
import { DonutChart } from '../charts/DonutChart';
import { ReportList } from './ReportList';

interface ProjectReportPreviewProps {
	data: ReportTimeEntry[];
	from: Signal<Date>;
	to: Signal<Date>;
}

export const ProjectReportPreview = component$<ProjectReportPreviewProps>(({ data, from, to }) => {
	const daysSeries = useComputed$(() => {
		return columnChartSeriesAdapter(data, from.value, to.value);
	});

	// ____ PROJECTS _____ //
	const groupByProjectSeries = useComputed$(() => {
		return donutChartGroupByProjectsAdapter(data);
	});

	const listGroupByProjectSeries = useComputed$(() => {
		return listGroupByProjectsAdapter(data);
	});

	return (
		<div class='flex flex-col'>
			<div class='flex sm:flex-col md:flex-row lg:flex-row'>
				<div class='flex-1'>
					<DonutChart data={groupByProjectSeries} />
				</div>

				<div class='flex-auto'>
					<ReportList
						data={listGroupByProjectSeries}
						resultsPerPage={REPORT_LIST_RESULTS_PER_PAGE}
					/>
				</div>
			</div>

			<ColumnChart data={daysSeries} />
		</div>
	);
});
