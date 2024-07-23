import { format } from 'date-fns';

const getDateFromMonthYear = (monthYear: string): Date => {
	const [month, year] = monthYear.split('_');
	return new Date(`20${year}-${month}`);
};

export const getDateLabelFromMonthYear = (monthYear: string): string =>
	getDateFromMonthYear(monthYear).toLocaleDateString('en-EN', {
		month: 'long',
		year: 'numeric',
	});

export const formatDateString = (date: Date, extended?: boolean): string => {
	return extended ? format(date, 'eeee, dd MMMM yyyy') : format(date, 'yyyy-MM-dd');
};
