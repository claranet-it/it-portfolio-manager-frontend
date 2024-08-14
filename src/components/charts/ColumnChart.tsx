import { component$, useComputed$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { ColumnChartSeries } from '@models/report';
import ApexCharts from 'apexcharts';
import { format } from 'node_modules/date-fns';
import { getHexFromType } from 'src/utils/report';
import { getFormattedHours } from 'src/utils/timesheet';

interface ColumnChartProps {
	series: ColumnChartSeries[];
}

export const ColumnChart = component$<ColumnChartProps>(({ series }) => {
	const ref = useSignal<HTMLElement>();

	const options = useComputed$(() => {
		return {
			series: series.map((item) => {
				return {
					name: item.label,
					color: getHexFromType(item.type),
					data: item.data,
				};
			}),
			chart: {
				type: 'bar',
				height: '461px',
				stacked: true,
				fontFamily: 'Inter, sans-serif',
				toolbar: {
					show: false,
				},
			},
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '70%',
				},
			},
			tooltip: {
				shared: true,
				intersect: false,
				style: {
					fontFamily: 'Inter, sans-serif',
				},
			},
			states: {
				hover: {
					filter: {
						type: 'darken',
						value: 1,
					},
				},
			},
			stroke: {
				show: true,
				width: 0,
				colors: ['transparent'],
			},
			grid: {
				show: true,
				strokeDashArray: 0,
				padding: {
					left: 2,
					right: 2,
					top: -14,
				},
			},
			dataLabels: {
				enabled: false,
			},
			legend: {
				show: false,
			},
			xaxis: {
				floating: false,
				labels: {
					show: true,
					style: {
						fontFamily: 'Inter, sans-serif',
						cssClass: 'text-xs font-normal fill-gark-grey',
					},
					formatter: (value: string) => {
						return format(new Date(value), 'EEE, MMM d');
					},
				},
				axisBorder: {
					show: true,
				},
				axisTicks: {
					show: true,
				},
			},
			yaxis: {
				show: true,
				labels: {
					style: {
						fontFamily: 'Inter, sans-serif',
						cssClass: 'text-xs font-normal fill-darkgray-300',
					},
					formatter: (value: number) => {
						return getFormattedHours(value) + ' h';
					},
				},
			},
			fill: {
				opacity: 1,
			},
		};
	});

	useVisibleTask$(async ({ track }) => {
		track(() => series);
		const chart = new ApexCharts(ref.value, options.value);
		chart.render();
		return () => chart.destroy();
	});

	return <div ref={ref} class='w-full py-6' />;
});
