import { Customer } from './customer';

export type Task = {
	id: string;
	name: string;
	completed: boolean;
	plannedHours: number;
};

export type TaskProjectCustomer = {
	customer: Customer;
	project: string;
	task: Task;
};
