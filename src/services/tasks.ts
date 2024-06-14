import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

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
