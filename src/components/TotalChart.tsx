import { $, Signal, component$, useComputed$ } from '@builder.io/qwik';
import { getDateLabelFromMonthYear } from '../utils/dates';
import { Chart } from './Chart';
import { EffortMatrix } from '@models/effort';
import { Month } from '@models/month';

export const TotalChart = component$<{
	monthYearList: Signal<string[]>;
	effortSig: Signal<EffortMatrix>;
}>(({ monthYearList, effortSig }) => {
	const labelsSig = useComputed$(() =>
		monthYearList.value.map((monthYear) => getDateLabelFromMonthYear(monthYear))
	);

	const extractData = $((fn: (month: Month) => number) => {
		const data: number[] = [];
		for (const monthYear of monthYearList.value) {
			data.push(
				Math.round(
					effortSig.value.reduce((acc, item) => {
						const [[_, { effort }]] = Object.entries(item);
						acc += fn(effort.find(({ month_year }) => month_year === monthYear)!);
						return acc;
					}, 0) / effortSig.value.length
				)
			);
		}
		return data;
	});

	return <Chart effortSig={effortSig} extractData={extractData} labels={labelsSig} />;
});
