import { Customer } from './customer';
import { Project } from './project';
import { Task } from './task';

export type TimeEntry = {
	user?: string;
	date: string;
	company: string;
	customer: Customer;
	project: Project;
	task: Task;
	hours: number;
	startHour?: string;
	endHour?: string;
	description?: string;
	isUnsaved?: boolean;
	index?: string;
	name?: string;
};

export type TimeEntryObject = Omit<TimeEntry, 'company' | 'isUnsaved'>;

export type TimeEntryRow = {
	[project: string]: TimeEntry[];
};

export type Day = {
	name: string;
	date: Date;
	weekend: boolean;
};

export type ProjectCategoryProp = {
	label: string;
	bgColor: string;
	borderColor: string;
};
