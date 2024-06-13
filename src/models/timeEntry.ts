import { Task } from './Task';
import { Customer } from './Customer';
import { Project } from './Project';

export type TimeEntry = {
	date: Date;
	company: string;
	customer: Customer;
	project: Project;
	task: Task;
	hours: number;
};
