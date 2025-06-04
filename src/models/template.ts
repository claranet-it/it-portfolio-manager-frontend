import { Customer } from './customer';
import { Project } from './project';
import { Task } from './task';

export type Template = {
	id: string;
	user: string;
	customer: Customer;
	project: Project;
	task?: Task;
	date_start: string;
	date_end: string;
	daytime: number[];
	timehours: number;
};
