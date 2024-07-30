import { t } from 'src/locale/labels';
import { ProjectCategoryProp, TimeEntry } from '../models/timeEntry';

export const getTotalHours = (hours: number[]) => {
	return hours.length > 0 ? hours.reduce((total, amount) => total + amount) : 0;
};

export const getlHoursPerProject = (timeEntries: TimeEntry[]) => {
	return timeEntries.map((item) => item.hours);
};

export const getFormattedHours = (hours: number) => {
	const hoursPart = Math.floor(hours);
	const minutesPart = (hours - hoursPart) * 60;

	const hour = hoursPart < 10 ? `0${hoursPart}` : hoursPart.toString();
	const minute =
		minutesPart < 10 ? `0${Math.round(minutesPart)}` : Math.round(minutesPart).toString();

	return `${hour}:${minute}`;
};

export const getTotalHoursPerRows = (hoursPerRows: number[]) => {
	return getTotalHours(hoursPerRows);
};

export const convertTimeToDecimal = (time: string): number => {
	const [hours, minutes] = time.split(':').map(Number);
	return hours + minutes / 60;
};

export const isEqualEntries = (entryA: TimeEntry, entryB: TimeEntry): Boolean => {
	return (
		entryA.customer === entryB.customer &&
		entryA.project === entryB.project &&
		entryA.task === entryB.task
	);
};

export const isEqualEntriesDeep = (entryA: TimeEntry, entryB: TimeEntry): Boolean => {
	return isEqualEntries(entryA, entryB) && entryA.date === entryB.date;
};

export const getEndHour = (startHour: number, endHour: number, hours: number) => {
	if (startHour === 0 || endHour === 0) {
		return endHour;
	}
	if (startHour + hours === endHour) {
		return endHour;
	}

	return startHour + hours;
};

export const getLegendProjectCateogriesProp = (type: string): ProjectCategoryProp => {
	switch (type) {
		case 'absence': {
			return {
				label: t('PROJECT_ABSENCE_LABEL'),
				bgColor: 'bg-pink-1',
			};
		}
		case 'slack-time': {
			return {
				label: t('PROJECT_SLACKTIME_LABEL'),
				bgColor: 'bg-yellow-100',
			};
		}
		case 'billable': {
			return {
				label: t('PROJECT_BILLABLE_LABEL'),
				bgColor: 'bg-green-500',
			};
		}
		case 'non-billable': {
			return {
				label: t('PROJECT_NON_BILLABLE_LABEL'),
				bgColor: 'bg-green-200',
			};
		}
		default: {
			return {
				label: '',
				bgColor: '',
			};
		}
	}
};
