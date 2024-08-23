import { component$, Signal, useComputed$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { DonutChartSeries } from '@models/report';
import ApexCharts from 'apexcharts';
import { t } from 'src/locale/labels';
import { getHexFromType } from 'src/utils/report';
import { getFormattedHours } from 'src/utils/timesheet';

interface DonutChartProps {
	data: Signal<DonutChartSeries>;
}

export const DonutChart = component$<DonutChartProps>(({ data }) => {
	const ref = useSignal<HTMLElement>();

	const totalHours = useComputed$(() => {
		return data.value.series.reduce((a, b) => a + b, 0);
	});

	const colors = useComputed$(() => {
		if (data.value.colors) return data.value.colors;

		return data.value.types?.map((type) => getHexFromType(type));
	});

	const options = useComputed$(() => {
		return {
			series: data.value.series,
			colors: colors.value,
			chart: {
				type: 'donut',
			},
			stroke: {
				show: false,
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
			labels: data.value.labels,
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
						const percentage =
							((data.value.series[index] / totalHours.value) * 100).toFixed(2) + '%';
						return percentage;
					},
				},
			},
		};
	});

	useVisibleTask$(async ({ track }) => {
		track(() => data.value.series);
		track(() => data.value.types);
		track(() => data.value.labels);
		track(() => options.value);

		const chart = new ApexCharts(ref.value, options.value);
		chart.render();
		return () => chart.destroy();
	});

	return <div ref={ref} class='w-full' />;
});
