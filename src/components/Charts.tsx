import {
	$,
	Signal,
	component$,
	noSerialize,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import { Chart, registerables } from 'chart.js';
import { t } from '../locale/labels';
import { Effort } from '../utils/types';

export const Charts = component$<{ effort: Signal<Effort> }>(({ effort }) => {
	const chartElSig = useSignal<HTMLCanvasElement>();
	const chartSig = useSignal<Chart<'bar', string[], string>>();

	const extractNames = $(() => {
		const names: string[] = [];
		effort.value.map((item) => {
			const [[name]] = Object.entries(item);
			names.push(name.replace('@claranet.com', '').toLowerCase());
		});
		return names;
	});

	const getConfirmedData = $((monthYear = '12_24') => {
		const data: string[] = [];
		effort.value.map((item) => {
			const [[_, value]] = Object.entries(item);
			{
				value
					.filter((m) => m.month_year === monthYear)
					.map((month) => data.push(month.confirmedEffort.toString()));
			}
		});
		return data;
	});

	const getTentativeData = $((monthYear = '12_24') => {
		const data: string[] = [];
		effort.value.map((item) => {
			const [[_, value]] = Object.entries(item);
			{
				value
					.filter((m) => m.month_year === monthYear)
					.map((month) => data.push(month.tentativeEffort.toString()));
			}
		});
		return data;
	});

	const getEmptyData = $((monthYear = '12_24') => {
		const data: string[] = [];
		effort.value.map((item) => {
			const [[_, value]] = Object.entries(item);
			{
				value
					.filter((m) => m.month_year === monthYear)
					.map((month) =>
						data.push(
							(100 - month.confirmedEffort - month.tentativeEffort).toString()
						)
					);
			}
		});
		return data;
	});

	useVisibleTask$(async () => {
		const labels = await extractNames();
		const confirmedData = await getConfirmedData();
		const tentativeData = await getTentativeData();
		const emptyData = await getEmptyData();
		if (chartElSig?.value) {
			Chart.register(...registerables);
			chartSig.value = noSerialize(
				new Chart(chartElSig.value, {
					type: 'bar',
					data: {
						labels: labels,
						datasets: [
							{
								label: t('confirmedEffort'),
								data: confirmedData,
								borderWidth: 1,
								backgroundColor: 'blue',
							},
							{
								label: t('tentativeEffort'),
								data: tentativeData,
								borderWidth: 1,
								backgroundColor: 'orange',
							},
							{
								label: t('empty'),
								data: emptyData,
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
		const confirmedData = await getConfirmedData();
		const tentativeData = await getTentativeData();
		const emptyData = await getEmptyData();
		if (chartSig.value) {
			chartSig.value.data.datasets.forEach((dataset, i) => {
				switch (dataset.label) {
					case t('confirmedEffort'):
						return (dataset.data = confirmedData);
					case t('tentativeEffort'):
						return (dataset.data = tentativeData);
					case t('empty'):
						return (dataset.data = emptyData);
				}
			});
			chartSig.value.update();
		}
	});

	return (
		<div class='h-[300px]'>
			<canvas ref={chartElSig} id='myChart'></canvas>
		</div>
	);
});
