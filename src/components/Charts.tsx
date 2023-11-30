import {
	$,
	Signal,
	component$,
	useSignal,
	useTask$,
	useVisibleTask$,
} from '@builder.io/qwik';
import { Chart, registerables } from 'chart.js';
import { t } from '../locale/labels';
import { Effort } from '../utils/types';

export const Charts = component$<{ effort: Signal<Effort> }>(({ effort }) => {
	const myChart = useSignal<HTMLCanvasElement>();

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
		if (myChart?.value) {
			Chart.register(...registerables);
			new Chart(myChart.value, {
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
			});
		}
	});

	useTask$(({ track }) => {
		track(() => effort.value);
		console.log('change', effort.value);
	});

	return (
		<div class='h-[300px]'>
			<canvas ref={myChart} id='myChart'></canvas>
		</div>
	);
});
