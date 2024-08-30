import { $, useSignal, useTask$ } from '@builder.io/qwik';
import { Day } from '../../models/timeEntry';
import {
	currentWeek as currentWeekAsRange,
	dateToWeekRange,
	getDaysInRange,
	nextWeek as nextWeekRange,
	prevWeek as prevWeekRange,
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
		const range = nextWeekRange(to.value);
		from.value = range.from;
		to.value = range.to;
		updateDays();
	});

	const prevWeek = $(() => {
		const range = prevWeekRange(from.value);
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

	const setWeek = $((date: Date) => {
		const range = dateToWeekRange(date);
		from.value = range.from;
		to.value = range.to;
		updateDays();
	});

	useTask$(() => {
		updateDays();
	});

	return { days, from, to, prevWeek, nextWeek, currentWeek, setWeek };
};
