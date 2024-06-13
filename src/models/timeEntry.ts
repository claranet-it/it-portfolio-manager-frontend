import { Customer } from './Customer';
import { Project } from './Project';
import { Task } from './Task';

export type TimeEntry = {
	date: string;
	company: string;
	customer: Customer;
	project: Project;
	task: Task;
	hours: number;
	isUnsaved?: boolean;
};

export type TimeEntryObject = Omit<TimeEntry, 'company'>;

export type TimeEntryRow = {
	[project: string]: TimeEntry[];
};

export type Day = {
	name: string;
	date: Date;
};
