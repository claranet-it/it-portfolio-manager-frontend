import { TimeEntry } from '../models/timeEntry';

export const getTotalHours = (hours: number[]) => {
	return hours.length > 0 ? hours.reduce((total, amount) => total + amount) : 0;
};

export const getlHoursPerProject = (timeEntries: TimeEntry[]) => {
	return timeEntries.map((item) => item.hours);
};

export const getFormattedHours = (hours: number) => {
	let hoursPart = Math.floor(hours);
	let minutesPart = ((hours - hoursPart) * 100) % 100;

	let hour;
	let minute;

	if (hoursPart < 10) {
		hour = `0${hoursPart}`;
	} else hour = hoursPart;
	if (minutesPart < 10) {
		minute = `0${minutesPart}`;
	} else minute = minutesPart;

	return `${hour}:${minute}`;
};

export const getTotalHoursPerRows = (hoursPerRows: number[]) => {
	return getTotalHours(hoursPerRows);
};
