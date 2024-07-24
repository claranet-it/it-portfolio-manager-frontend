import { endOfISOWeek, format, isWeekend, startOfISOWeek } from 'date-fns';
import { Day } from '../models/timeEntry';

export type Range = {
	from: Date;
	to: Date;
};

const getDateFromMonthYear = (monthYear: string): Date => {
	const [month, year] = monthYear.split('_');
	return new Date(`20${year}-${month}`);
};

export const getDateLabelFromMonthYear = (monthYear: string): string =>
	getDateFromMonthYear(monthYear).toLocaleDateString('en-EN', {
		month: 'long',
		year: 'numeric',
	});

export const formatDateString = (date: Date): string => {
	return format(date, 'yyyy-MM-dd');
};

const dateToDay = (date: Date): Day => {
	return {
		name: format(date, 'EE'),
		date: new Date(date),
		weekend: isWeekend(date),
	};
};

export const getDaysInRange = (from: Date, to: Date): Day[] => {
	const days = [];
	const day = new Date(from);
	while (day <= to) {
		days.push(dateToDay(day));
		day.setDate(day.getDate() + 1);
	}
	return days;
};

const dateToWeekRange = (date: Date): Range => {
	const from = startOfISOWeek(date);
	const to = endOfISOWeek(date);
	return { from, to };
};

export const currentWeek = (): Range => {
	return dateToWeekRange(new Date());
};

export const nextWeek = (from: Date): Range => {
	const nextWeek = new Date(from);
	nextWeek.setDate(nextWeek.getDate() + 7);
	return dateToWeekRange(nextWeek);
};

export const prevWeek = (from: Date): Range => {
	const prevWeek = new Date(from);
	prevWeek.setDate(prevWeek.getDate() - 7);
	return dateToWeekRange(prevWeek);
};
