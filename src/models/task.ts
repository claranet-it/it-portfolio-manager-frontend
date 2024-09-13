export type Task = {
	name: string;
	completed: boolean;
	plannedHours: number;
};

export type TaskProjectCustomer = {
	customer: string;
	project: string;
	task: string;
};
