import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getTasks = async (
	company: string = 'it',
	customer: Customer,
	project: Project
): Promise<Task[]> =>
	getHttpResponse<Task[]>({
		path: `task/task`,
		params: {
			company,
			customer,
			project: project.name,
		},
	});

export const saveTask = async (
	company: string = 'it',
	customer: Customer,
	project: Project,
	task: Task,
	index?: number
): Promise<boolean> =>
	checkHttpResponseStatus(`task/task`, 200, 'POST', {
		company: company,
		customer: customer,
		project: project,
		task: task,
		index: index,
	});

export const editTask = async (
	customer: Customer,
	project: Project,
	task: Task,
	editedTask: Task
) =>
	checkHttpResponseStatus('task/task', 200, 'PUT', {
		customer: customer,
		project: project.name,
		task: task,
		newTask: editedTask,
	});
