const getDateFromMonthYear = (monthYear: string): Date => {
	const [month, year] = monthYear.split('_');
	return new Date(`20${year}-${month}`);
};

export const getDateLabelFromMonthYear = (monthYear: string): string =>
	getDateFromMonthYear(monthYear).toLocaleDateString('it-IT', {
		month: 'short',
		year: '2-digit',
	});
