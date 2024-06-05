import moment from 'moment';
import { TimeEntry } from '../models/timeEntry';

export const getTotalHoursPerDay = (hours: number[]) => {
	return hours.length > 0 ? hours.reduce((total, amount) => total + amount) : 0;
};

export const getlHoursPerProject = (timeEntries: TimeEntry[]) => {
	return timeEntries.map((item) => item.hours);
};

export const getFormattedHours = (hours: number) => {
	return moment(hours, 'HH').format('HH:mm');
};
