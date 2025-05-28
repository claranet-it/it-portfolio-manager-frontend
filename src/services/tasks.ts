import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task, TaskProjectCustomer } from '@models/task';
import {
	decryptString,
	decryptTask,
	encryptCustomer,
	encryptProject,
	encryptString,
} from 'src/utils/cipher-entities';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getTasks = async (
	customer: Customer,
	project: Project | string,
	hideCompleted?: boolean
): Promise<Task[]> => {
	const response = await getHttpResponse<Task[]>({
		path: `task/task`,
		params: {
			customer: await encryptCustomer(customer),
			project:
				typeof project === 'string'
					? await encryptString(project)
					: (await encryptProject(project)).name,
			...(hideCompleted !== undefined &&
				hideCompleted !== false && {
					completed: 'false',
				}),
		},
	});

	return Promise.all(response.map(decryptTask));
};

export const saveTask = async (
	customer: Customer,
	project: Project,
	task: string,
	index?: number
): Promise<boolean> =>
	checkHttpResponseStatus(`task/task`, 200, 'POST', {
		customer: await encryptCustomer(customer),
		project: await encryptProject(project),
		task: await encryptString(task),
		index: index,
	});

export const editTaskName = async (
	customer: Customer,
	project: Project,
	task: string,
	newTaskName: string
) =>
	checkHttpResponseStatus('task/task', 200, 'PUT', {
		customer: await encryptCustomer(customer),
		project: (await encryptProject(project)).name,
		task: await encryptString(task),
		newTask: await encryptString(newTaskName),
	});

export const editTask = async (
	customer: Customer,
	project: Project,
	task: string,
	completed: boolean,
	plannedHours: number
) =>
	checkHttpResponseStatus('task/task-properties', 200, 'POST', {
		customer: await encryptCustomer(customer),
		project: (await encryptProject(project)).name,
		task: await encryptString(task),
		completed: completed,
		plannedHours: plannedHours,
	});

export const getAllTasks = async (): Promise<TaskProjectCustomer[]> => {
	const response = await getHttpResponse<TaskProjectCustomer[]>({
		path: 'task/task-list',
	});

	return Promise.all(
		response.map(async (data) => ({
			customer: await decryptString(data.customer),
			project: await decryptString(data.project),
			task: await decryptString(data.task),
		}))
	);
};
