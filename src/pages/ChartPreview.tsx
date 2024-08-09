import { component$, useVisibleTask$ } from '@builder.io/qwik';
import ApexCharts from 'apexcharts';

export const ChartPreview = component$(() => {
	const options = {
		series: [44, 55, 13, 33],
		labels: ['Apple', 'Mango', 'Orange', 'Watermelon'],
	};

	useVisibleTask$(() => {
		var chart = new ApexCharts(document.querySelector('#chart'), options);

		chart.render();
	});

	return <div class='py-6' id='chart'></div>;
});
