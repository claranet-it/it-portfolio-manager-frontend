import { $, Signal, component$, useComputed$ } from '@builder.io/qwik';
import { EffortMatrix, Month } from '../utils/types';
import { Chart } from './Chart';

export const MonthChart = component$<{
	monthYear: string;
	effortSig: Signal<EffortMatrix>;
}>(({ monthYear, effortSig }) => {
	const labelsSig = useComputed$(() =>
		effortSig.value.map((item) => Object.values(item)[0].name)
	);

	const extractData = $((fn: (month: Month) => number) => {
		const data: number[] = [];
		effortSig.value.map((item) => {
			const [{ effort }] = Object.values(item);
			data.push(...effort.filter(({ month_year }) => month_year === monthYear).map(fn));
		});
		return data;
	});

	return <Chart effortSig={effortSig} extractData={extractData} labels={labelsSig} />;
});
