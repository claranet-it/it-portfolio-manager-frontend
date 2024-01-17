import {
	$,
	Signal,
	component$,
	noSerialize,
	useComputed$,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import { Chart, registerables } from 'chart.js';
import { t } from '../locale/labels';
import { Effort, Month } from '../utils/types';
import { getDateLabelFromMonthYear } from '../utils/dates';

export const TotalChart = component$<{
	monthYearList: Signal<string[]>;
	effort: Signal<Effort>;
}>(({ monthYearList, effort }) => {
	const chartElSig = useSignal<HTMLCanvasElement>();
	const chartSig = useSignal<Chart<'bar', number[], string>>();

	const extractData = $((fn: (month: Month) => number) => {
		const data: number[] = [];
		for (const monthYear of monthYearList.value) {
			data.push(
				effort.value.reduce((acc, item) => {
					const [[_, value]] = Object.entries(item);
					acc += fn(
						value.find(
							({ month_year }) => month_year === monthYear
						)!
					);
					return acc;
				}, 0) / effort.value.length
			);
		}
		return data;
	});

	const confirmedDataSig = useComputed$(
		async () => await extractData((month) => month.confirmedEffort)
	);

	const tentativeDataSig = useComputed$(
		async () => await extractData((month) => month.tentativeEffort)
	);

	const emptyDataSig = useComputed$(
		async () =>
			await extractData(
				(month) => 100 - month.confirmedEffort - month.tentativeEffort
			)
	);

	useVisibleTask$(async ({ track }) => {
		track(() => effort.value);
		if (chartElSig?.value) {
			Chart.register(...registerables);
			if (chartSig.value) chartSig.value.destroy();
			chartSig.value = noSerialize(
				new Chart(chartElSig.value, {
					type: 'bar',
					data: {
						labels: monthYearList.value.map((monthYear) =>
							getDateLabelFromMonthYear(monthYear)
						),
						datasets: [
							{
								label: t('confirmedEffort'),
								data: confirmedDataSig.value,
								borderWidth: 1,
								backgroundColor: '#ef4444',
							},
							{
								label: t('tentativeEffort'),
								data: tentativeDataSig.value,
								borderWidth: 1,
								backgroundColor: '#fcc82b',
							},
							{
								label: t('empty'),
								data: emptyDataSig.value,
								borderWidth: 1,
								backgroundColor: 'transparent',
							},
						],
					},
					options: {
						scales: {
							y: { beginAtZero: true, stacked: true },
							x: { beginAtZero: true, stacked: true },
						},
					},
				})
			);
		}
	});

	useVisibleTask$(async ({ track }) => {
		track(() => effort.value);
		if (chartSig.value) {
			chartSig.value.data.datasets.forEach((dataset) => {
				switch (dataset.label) {
					case t('confirmedEffort'):
						return (dataset.data = confirmedDataSig.value);
					case t('tentativeEffort'):
						return (dataset.data = tentativeDataSig.value);
					case t('empty'):
						return (dataset.data = emptyDataSig.value);
				}
			});
			chartSig.value.update();
		}
	});

	return (
		<div class='h-[300px] w-[600px]'>
			<canvas ref={chartElSig} id='myChart'></canvas>
		</div>
	);
});
