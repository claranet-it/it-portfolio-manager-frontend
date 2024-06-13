import { Customer } from './customer';
import { Project } from './project';
import { Task } from './task';

export type TimeEntry = {
	date: Date;
	company: string;
	customer: Customer;
	project: Project;
	task: Task;
	hours: number;
};
