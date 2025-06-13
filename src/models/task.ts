import { Customer } from './customer';
import { Project } from './project';

export type Task = {
	id: string;
	name: string;
	completed: boolean;
	plannedHours: number;
};

export type TaskProjectCustomer = {
	customer: Customer;
	project: Project;
	task: Task;
};
