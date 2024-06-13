import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';
import { Customer } from '../models/Customer';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

export const getTasks = async (
	company: string = 'it',
	customer: Customer,
	project: Project
): Promise<Task[]> =>
	getHttpResponse<Task[]>(`task/task?company=${company}&customer=${customer}&project=${project}`);

export const saveTask = async (
	company: string = 'it',
	customer: Customer,
	project: Project,
	task: Task
): Promise<boolean> =>
	checkHttpResponseStatus(`task/task`, 200, 'POST', {
		company: company,
		customer: customer,
		project: project,
		task: task,
	});
