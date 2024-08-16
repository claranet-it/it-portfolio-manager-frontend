import { component$, Signal, useComputed$ } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';
import { t } from 'src/locale/labels';
import { columnChartSeriesAdapter, donutChartGroupByProjectsAdapter } from 'src/utils/chart';
import { ColumnChart } from '../charts/ColumnChart';
import { DonutChart } from '../charts/DonutChart';

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

	return (
		<div class='flex flex-col p-3 divide-y divide-surface-70'>
			<ColumnChart series={daysSeries.value} />

			<div class='flex sm:flex-col md:flex-row lg:flex-row py-6'>
				<h3 class='text-xl font-bold text-dark-grey'>{t('PROJECT_LABEL')}</h3>

				<DonutChart
					series={groupByProjectSeries.value.series}
					types={groupByProjectSeries.value.types}
					labels={groupByProjectSeries.value.labels}
				/>
			</div>
		</div>
	);
});
