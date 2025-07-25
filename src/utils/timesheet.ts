import { t } from 'src/locale/labels';
import { Day, ProjectCategoryProp, TimeEntry } from '../models/timeEntry';
import { isInInterval } from './dateIntervals';

const HOURS_PER_DAY = 8;
const HOURS_PER_WEEK = 8 * 5;

export const getTotalPerDay = (timeEntries: TimeEntry[]) => {
	return getFormattedHours(getTotalHours(getlHoursPerProject(timeEntries)));
};

export const dayHasTooManyHours = (timeEntries: TimeEntry[]) => {
	return getTotalHours(getlHoursPerProject(timeEntries)) > HOURS_PER_DAY;
};

export const getTotal = (hours: number[]) => {
	return getFormattedHours(getTotalHoursPerRows(hours));
};

export const weekHasTooManyHours = (hours: number[]) => {
	return getTotalHoursPerRows(hours) > HOURS_PER_WEEK;
};

export const getTotalPerProject = (hours: number[]) => {
	return getFormattedHours(getTotalHoursPerRows(hours));
};

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

export const isEqualEntries = (entryA: TimeEntry, entryB: TimeEntry): boolean => {
	return (
		entryA.customer === entryB.customer &&
		entryA.project === entryB.project &&
		entryA.task.name === entryB.task.name
	);
};

export const isEqualEntriesDeep = (entryA: TimeEntry, entryB: TimeEntry): boolean => {
	return isEqualEntries(entryA, entryB) && entryA.date === entryB.date;
};

export const getComputedHours = (startHour: number, endHour: number, hours: number) => {
	if (startHour !== 0 && endHour !== 0) {
		if (startHour + hours === endHour) {
			return {
				startHour,
				endHour,
				hours,
			};
		}

		if (startHour > endHour || hours > endHour - startHour) {
			return {
				startHour,
				endHour: startHour + hours,
				hours: hours,
			};
		}
	}

	return {
		startHour: 0,
		endHour: 0,
		hours,
	};
};

export const getProjectCateogriesProp = (type: string): ProjectCategoryProp => {
	switch (type) {
		case 'absence': {
			return {
				label: t('PROJECT_ABSENCE_LABEL'),
				bgColor: 'pink-1',
				borderColor: 'shadow-pink-1',
			};
		}
		case 'slack-time': {
			return {
				label: t('PROJECT_SLACKTIME_LABEL'),
				bgColor: 'yellow-100',
				borderColor: 'shadow-yellow-100',
			};
		}
		case 'billable': {
			return {
				label: t('PROJECT_BILLABLE_LABEL'),
				bgColor: 'green-500',
				borderColor: 'shadow-green-500',
			};
		}
		case 'non-billable': {
			return {
				label: t('PROJECT_NON_BILLABLE_LABEL'),
				bgColor: 'green-200',
				borderColor: 'shadow-green-200',
			};
		}
		default: {
			return {
				label: '',
				bgColor: 'trasparent-color',
				borderColor: 'shadow-trasparent-color',
			};
		}
	}
};

export const getTotalPerWeek = (template: any, days: Day[]) => {
	let tot = 0;
	days.forEach((day) => {
		const dayOfWeek = day.date.getDay();

		if (
			template.daytime.includes(dayOfWeek) &&
			isInInterval(day.date, new Date(template.date_start), new Date(template.date_end))
		) {
			tot += template.timehours;
		}
	});
	return getFormattedHours(tot);
};
