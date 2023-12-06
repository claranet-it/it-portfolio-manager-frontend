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
import { purgeName } from '../utils';
import { Effort, Month } from '../utils/types';

export const Charts = component$<{ monthYear: string; effort: Signal<Effort> }>(
	({ monthYear, effort }) => {
		const chartElSig = useSignal<HTMLCanvasElement>();
		const chartSig = useSignal<Chart<'bar', string[], string>>();

		const labelsSig = useComputed$(() => {
			const names: string[] = [];
			effort.value.map((item) => {
				const [[name]] = Object.entries(item);
				names.push(purgeName(name));
			});
			return names;
		});

		const extractData = $((fn: (month: Month) => string) => {
			const data: string[] = [];
			effort.value.map((item) => {
				const [[_, value]] = Object.entries(item);
				data.push(...value.filter((m) => m.month_year === monthYear).map(fn));
			});
			return data;
		});

		const confirmedDataSig = useComputed$(
			async () => await extractData((month) => month.confirmedEffort.toString())
		);

		const tentativeDataSig = useComputed$(
			async () => await extractData((month) => month.tentativeEffort.toString())
		);

		const emptyDataSig = useComputed$(
			async () =>
				await extractData((month) =>
					(100 - month.confirmedEffort - month.tentativeEffort).toString()
				)
		);

		useVisibleTask$(async () => {
			if (chartElSig?.value) {
				Chart.register(...registerables);
				chartSig.value = noSerialize(
					new Chart(chartElSig.value, {
						type: 'bar',
						data: {
							labels: labelsSig.value,
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
			<div class='h-[300px] w-full'>
				<canvas ref={chartElSig} id='myChart'></canvas>
			</div>
		);
	}
);
