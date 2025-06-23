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

export type PayloadCreateTemplate = {
	customer_id: string;
	project_id: string;
	task_id?: string;
	date_start: string;
	date_end: string;
	daytime: number[];
	timehours: number;
};

export type PayloadUpdateTemplate = {
	date_start?: string;
	date_end?: string;
	daytime?: number[];
	timehours?: number;
};
