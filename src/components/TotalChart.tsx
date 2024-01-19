import { $, Signal, component$, useComputed$ } from '@builder.io/qwik';
import { getDateLabelFromMonthYear } from '../utils/dates';
import { Effort, Month } from '../utils/types';
import { Chart } from './Chart';

export const TotalChart = component$<{
	monthYearList: Signal<string[]>;
	effort: Signal<Effort>;
}>(({ monthYearList, effort }) => {
	const labelsSig = useComputed$(() =>
		monthYearList.value.map((monthYear) => getDateLabelFromMonthYear(monthYear))
	);

	const extractData = $((fn: (month: Month) => number) => {
		const data: number[] = [];
		for (const monthYear of monthYearList.value) {
			data.push(
				Math.round(
					effort.value.reduce((acc, item) => {
						const [[_, value]] = Object.entries(item);
						acc += fn(value.find(({ month_year }) => month_year === monthYear)!);
						return acc;
					}, 0) / effort.value.length
				)
			);
		}
		return data;
	});

	return <Chart effort={effort} extractData={extractData} labels={labelsSig} />;
});
