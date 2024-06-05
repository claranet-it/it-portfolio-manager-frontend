import moment from 'moment';

const getDateFromMonthYear = (monthYear: string): Date => {
	const [month, year] = monthYear.split('_');
	return new Date(`20${year}-${month}`);
};

export const getDateLabelFromMonthYear = (monthYear: string): string =>
	getDateFromMonthYear(monthYear).toLocaleDateString('en-EN', {
		month: 'long',
		year: 'numeric',
	});

export const formatDateString = (date: Date | string): string => {
	return moment(date).format('yyyy-MM-DD');
};
