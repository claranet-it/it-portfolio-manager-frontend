import { $, useSignal, useTask$ } from '@builder.io/qwik';
import { Day } from '../../models/timeEntry';
import {
	currentWeek as currentWeekAsRange,
	getDaysInRange,
	nextWeek as nextWeekAsRange,
	prevWeek as prevWeekAsRange,
} from '../../utils/dates';

export const useGetTimeSheetDays = () => {
	// INITIALIZZATION
	const range = currentWeekAsRange();
	const from = useSignal<Date>(range.from);
	const to = useSignal<Date>(range.to);
	const days = useSignal<Day[]>([]);

	const updateDays = $(() => {
		days.value = [...getDaysInRange(from.value, to.value)];
	});

	const nextWeek = $(() => {
		const range = nextWeekAsRange(from.value);
		from.value = range.from;
		to.value = range.to;
		updateDays();
	});

	const prevWeek = $(() => {
		const range = prevWeekAsRange(from.value);
		from.value = range.from;
		to.value = range.to;
		updateDays();
	});

	const currentWeek = $(() => {
		const range = currentWeekAsRange();
		from.value = range.from;
		to.value = range.to;
		updateDays();
	});

	useTask$(() => {
		updateDays();
	});

	return { days, from, to, prevWeek, nextWeek, currentWeek };
};
