import { Task } from './task';
import { Customer } from './customer';
import { Project } from './project';

export type TimeEntry = {
	date: Date;
	company: string;
	customer: Customer;
	project: Project;
	task: Task;
	hours: number;
};
