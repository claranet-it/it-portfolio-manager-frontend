import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Chart, registerables } from 'chart.js';
import { t } from '../locale/labels';

export const Charts = component$(() => {
	const myChart = useSignal<HTMLCanvasElement>();

	useVisibleTask$(() => {
		if (myChart?.value) {
			Chart.register(...registerables);
			new Chart(myChart.value, {
				type: 'bar',
				data: {
					labels: ['giorgio.boa', 'nicola.corvo'],
					datasets: [
						{
							label: t('confirmedEffort'),
							data: [20, 80],
							borderWidth: 1,
							backgroundColor: 'blue',
						},
						{
							label: t('tentativeEffort'),
							data: [40, 10],
							borderWidth: 1,
							backgroundColor: 'orange',
						},
						{
							label: t('empty'),
							data: [30, 10],
							borderWidth: 1,
							backgroundColor: 'transparent',
						},
					],
				},
				options: {
					scales: {
						y: {
							beginAtZero: true,
							stacked: true,
						},
						x: {
							beginAtZero: true,
							stacked: true,
						},
					},
				},
			});
		}
	});

	return (
		<div class='h-[300px]'>
			<canvas ref={myChart} id='myChart'></canvas>
		</div>
	);
});
