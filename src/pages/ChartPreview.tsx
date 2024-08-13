import { component$ } from '@builder.io/qwik';
import { DonutChart } from 'src/components/charts/DonutChart';

export const ChartPreview = component$(() => {
	const dataDonut = {
		series: [76, 96, 140, 58, 80, 159, 151],
		type: [
			'absence',
			'slackTime',
			'billableProductivity',
			'nonBillableProductivity',
			'slackTime',
			'nonBillableProductivity',
			'billableProductivity',
		],
		labels: [
			'Holiday - Absence',
			'Onboarding / CLT Meet - Companys functional productivity',
			'CLT-0427/24 - Globex Corporation - SOR Sviluppo e Cloud',
			'Formazione e riti (Lean Coffee, Book club)',
			'CLT-0571-24 - Acme Corporation - Rinnovo contrattuale Son Q2 2024',
			'Presales - Companys functional productivity',
			'Attività amministrative e legali - Functional',
		],
	};

	return (
		<div class='w-full flex flex-col p-1 text-center items-center'>
			<h1 class='text-2xl'>Donut</h1>
			<DonutChart
				series={dataDonut.series}
				types={dataDonut.type}
				labels={dataDonut.labels}
			/>
		</div>
	);
});
