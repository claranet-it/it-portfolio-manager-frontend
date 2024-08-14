import { component$, Signal, useComputed$ } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';
import { columnChartSeriesAdapter } from 'src/utils/chart';
import { ColumnChart } from '../charts/ColumnChart';

interface ProjectReportDetailsProps {
	data: ReportTimeEntry[];
	from: Signal<Date>;
	to: Signal<Date>;
}

export const ProjectReportDetails = component$<ProjectReportDetailsProps>(({ data, from, to }) => {
	const series = useComputed$(() => {
		return columnChartSeriesAdapter(data, from.value, to.value);
	});

	return (
		<div class='flex flex-col p-3'>
			<ColumnChart series={series.value} />
		</div>
	);
});
