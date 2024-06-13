import { TimeEntry } from '../models/timeEntry';

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
