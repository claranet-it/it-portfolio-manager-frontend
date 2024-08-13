import { component$ } from '@builder.io/qwik';
import { ColumnChartSeries } from '@models/report';
import { ColumnChart } from 'src/components/charts/ColumnChart';
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

	const dataDonutOneType = {
		series: [134],
		type: ['absence'],
		labels: ['Holiday - Absence'],
	};

	const dataColumn: ColumnChartSeries[] = [
		{
			label: 'Billable',
			type: 'billable',
			data: [
				{ x: '2024-08-01', y: 232 },
				{ x: '2024-08-02', y: 113 },
				{ x: '2024-08-03', y: 341 },
				{ x: '2024-08-04', y: 20 },
				{ x: '2024-08-05', y: 10 },
				{ x: '2024-08-06', y: 0 },
			],
		},
		{
			label: 'Absence',
			type: 'absence',
			data: [
				{ x: '2024-08-01', y: 232 },
				{ x: '2024-08-02', y: 113 },
				{ x: '2024-08-03', y: 341 },
				{ x: '2024-08-04', y: 100 },
				{ x: '2024-08-05', y: 30 },
				{ x: '2024-08-06', y: 20 },
			],
		},
		{
			label: 'Slack time',
			type: 'slackTime',
			data: [
				{ x: '2024-08-01', y: 20 },
				{ x: '2024-08-02', y: 50 },
				{ x: '2024-08-03', y: 200 },
				{ x: '2024-08-04', y: 0 },
				{ x: '2024-08-05', y: 20 },
				{ x: '2024-08-06', y: 200 },
			],
		},
	];

	const dataColumnOneType: ColumnChartSeries[] = [
		{
			label: 'Billable',
			type: 'billable',
			data: [
				{ x: '2024-08-01', y: 232 },
				{ x: '2024-08-02', y: 113 },
				{ x: '2024-08-03', y: 341 },
				{ x: '2024-08-04', y: 20 },
				{ x: '2024-08-05', y: 10 },
				{ x: '2024-08-06', y: 0 },
				{ x: '2024-08-07', y: 232 },
				{ x: '2024-08-08', y: 113 },
				{ x: '2024-08-08', y: 341 },
				{ x: '2024-08-09', y: 20 },
				{ x: '2024-08-10', y: 10 },
				{ x: '2024-08-11', y: 0 },
			],
		},
	];

	return (
		<div class='w-full flex flex-col p-1 text-center items-center'>
			<h1 class='text-2xl'>Donut</h1>
			<div class='w-full flex flex-row justify-between'>
				<DonutChart
					series={dataDonut.series}
					types={dataDonut.type}
					labels={dataDonut.labels}
				/>

				<DonutChart
					series={dataDonutOneType.series}
					types={dataDonutOneType.type}
					labels={dataDonutOneType.labels}
				/>
			</div>

			<h1 class='text-2xl'>Column chart</h1>
			<ColumnChart series={dataColumn} />

			<ColumnChart series={dataColumnOneType} />
		</div>
	);
});
