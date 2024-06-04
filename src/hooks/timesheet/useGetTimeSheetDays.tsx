import { $, useSignal, useTask$ } from '@builder.io/qwik';
import moment from 'moment';
import { Day } from '../../models/timeEntry';

export const useGetTimeSheetDays = () => {
	// INITIALIZZATION
	const _moment = moment();
	const from = useSignal<Date>(_moment!!.startOf('isoWeek').toDate());
	const to = useSignal<Date>(_moment!!.endOf('isoWeek').toDate());
	const days = useSignal<Day[]>([]);

	const updateDays = $(() => {
		days.value = []; // empty the days list
		const startDate = moment(from.value);
		const endDate = moment(to.value);
		let currentDate = startDate.clone();
		while (currentDate.isSameOrBefore(endDate)) {
			days.value.push({
				name: currentDate.format('ddd').toString(),
				date: currentDate.toDate(),
			});
			// Move to the next day
			currentDate.add(1, 'day');
		}
	});

	const nextWeek = $(() => {
		const _moment = moment(from.value);
		_moment.add(1, 'week');
		from.value = _moment.startOf('isoWeek').toDate();
		to.value = _moment.endOf('isoWeek').toDate();
		updateDays();
	});

	const prevWeek = $(() => {
		const _moment = moment(from.value);
		_moment.subtract(1, 'week');
		from.value = _moment.startOf('isoWeek').toDate();
		to.value = _moment.endOf('isoWeek').toDate();
		updateDays();
	});

	// const currentWeek = $(() => {
	// 	from.value = _moment.clone().startOf('isoWeek').toDate();
	// 	to.value = _moment.clone().endOf('isoWeek').toDate();
	// 	updateDays();
	// });

	useTask$(() => {
		updateDays();
	});

	return { days, from, to, prevWeek, nextWeek };
};
