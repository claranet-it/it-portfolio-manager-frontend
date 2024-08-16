import { component$, useComputed$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { ProjectType } from '@models/project';
import ApexCharts from 'apexcharts';
import { t } from 'src/locale/labels';
import { getHexFromType } from 'src/utils/report';
import { getFormattedHours } from 'src/utils/timesheet';

interface DonutChartProps {
	series: number[];
	types?: ProjectType[];
	labels: string[];
}

export const DonutChart = component$<DonutChartProps>(({ series, types, labels }) => {
	const ref = useSignal<HTMLElement>();

	const totalHours = series.reduce((a, b) => a + b, 0);

	const options = useComputed$(() => {
		return {
			series: series,
			colors: types?.map((type) => getHexFromType(type)),
			chart: {
				type: 'donut',
			},
			stroke: {
				colors: ['white'],
				lineCap: '',
			},
			plotOptions: {
				pie: {
					expandOnClick: false,
					donut: {
						labels: {
							show: true,
							name: {
								show: true,
								fontFamily: 'Arial',
								offsetY: 20,
							},
							total: {
								showAlways: true,
								show: true,
								label: t('CHART_HOURS_LABEL'),
								formatter: (value: any) => {
									const sum = value.globals.seriesTotals.reduce(
										(a: number, b: number) => {
											return a + b;
										},
										0
									);
									return getFormattedHours(sum);
								},
							},
							value: {
								show: true,
								fontFamily: 'Arial',
								offsetY: -20,
								formatter: (value: string) => {
									return value + '%';
								},
							},
						},
					},
				},
			},
			labels: labels,
			dataLabels: {
				enabled: false,
			},
			legend: {
				show: false,
			},
			yaxis: {
				labels: {
					formatter: (_: string, opts: any) => {
						const index = opts.seriesIndex;
						const percentage = ((series[index] / totalHours) * 100).toFixed(2) + '%';
						return percentage;
					},
				},
			},
		};
	});

	useVisibleTask$(async ({ track }) => {
		track(() => series);
		track(() => types);
		track(() => labels);
		track(() => options.value);

		const chart = new ApexCharts(ref.value, options.value);
		chart.render();
		return () => chart.destroy();
	});

	return <div ref={ref} class='w-full' />;
});
