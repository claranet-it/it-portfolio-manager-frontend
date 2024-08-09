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
