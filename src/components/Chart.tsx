import { Month } from '@models/month';
import {
	NoSerialize,
	QRL,
	Signal,
	component$,
	noSerialize,
	useComputed$,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import { EffortMatrix } from '@models/effort';
import { Month } from '@models/month';
import { Chart as TChart, registerables } from 'chart.js';
import { t } from '../locale/labels';
import { EffortMatrix } from '@models/effort';

export const Chart = component$<{
	effortSig: Signal<EffortMatrix>;
	labels: Signal<string[]>;
	extractData: QRL<(fn: (month: Month) => number) => number[]>;
}>(({ effortSig, labels, extractData }) => {
	const chartElSig = useSignal<HTMLCanvasElement>();
	const chartSig = useSignal<NoSerialize<TChart<'bar', number[], string>>>();

	const confirmedDataSig = useComputed$(
		async () => await extractData(({ confirmedEffort }) => confirmedEffort)
	);

	const tentativeDataSig = useComputed$(
		async () => await extractData(({ tentativeEffort }) => tentativeEffort)
	);

	const emptyDataSig = useComputed$(
		async () =>
			await extractData(
				({ confirmedEffort, tentativeEffort }) => 100 - confirmedEffort - tentativeEffort
			)
	);

	useVisibleTask$(async ({ track }) => {
		track(() => effortSig.value);
		if (chartElSig?.value) {
			TChart.register(...registerables);
			if (chartSig.value) chartSig.value.destroy();
			chartSig.value = noSerialize(
				new TChart(chartElSig.value, {
					type: 'bar',
					data: {
						labels: labels.value,
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
		track(() => effortSig.value);
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
