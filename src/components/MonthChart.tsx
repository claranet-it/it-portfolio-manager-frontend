import type { Signal } from '@builder.io/qwik';
import { $, component$, useComputed$ } from '@builder.io/qwik';
import { purgeName } from '../utils';
import type { Effort, Month } from '../utils/types';
import { Chart } from './Chart';

export const MonthChart = component$<{
	monthYear: string;
	effort: Signal<Effort>;
}>(({ monthYear, effort }) => {
	const labelsSig = useComputed$(() => {
		const names: string[] = [];
		effort.value.map((item) => {
			const [[name]] = Object.entries(item);
			names.push(purgeName(name));
		});
		return names;
	});

	const extractData = $((fn: (month: Month) => number) => {
		const data: number[] = [];
		effort.value.map((item) => {
			const [[, value]] = Object.entries(item);
			data.push(
				...value.filter((m) => m.month_year === monthYear).map(fn)
			);
		});
		return data;
	});

	return (
		<Chart effort={effort} extractData={extractData} labels={labelsSig} />
	);
});
