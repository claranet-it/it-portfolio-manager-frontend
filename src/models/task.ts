import { Customer } from './customer';

export type Task = {
	name: string;
	completed: boolean;
	plannedHours: number;
};

export type TaskProjectCustomer = {
	customer: Customer;
	project: string;
	task: string;
};
