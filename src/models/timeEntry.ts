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
};

export type TimeEntryObject = Omit<TimeEntry, 'company'>;

export type Day = {
	name: string;
	date: Date;
};
