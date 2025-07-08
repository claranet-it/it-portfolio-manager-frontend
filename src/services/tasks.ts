import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task, TaskProjectCustomer } from '@models/task';
import {
	decryptCustomer,
	decryptProject,
	decryptTask,
	encryptCustomer,
	encryptProject,
	encryptString,
} from 'src/utils/cipher-entities';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getTasks = async (
	customer: Customer,
	project: Project,
	hideCompleted?: boolean
): Promise<Task[]> => {
	const response = await getHttpResponse<Task[]>({
		path: `task/task`,
		params: {
			customer: customer.id,
			project: project.id,
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
		index,
	});

export const editTaskName = async (
	customer: Customer,
	project: Project,
	task: Task,
	newTaskName: string
) =>
	checkHttpResponseStatus('task/task', 200, 'PUT', {
		customer: customer.id,
		project: project.id,
		task: task.id,
		newTask: await encryptString(newTaskName),
	});

export const editTask = async (
	customer: Customer,
	project: Project,
	task: Task,
	completed: boolean,
	plannedHours: number
) =>
	checkHttpResponseStatus('task/task-properties', 200, 'POST', {
		customer: customer.id,
		project: project.id,
		task: task.id,
		completed: completed,
		plannedHours: plannedHours,
	});

export const getAllTasks = async (): Promise<TaskProjectCustomer[]> => {
	const response = await getHttpResponse<TaskProjectCustomer[]>({
		path: 'task/task-list',
	});

	return Promise.all(
		response.map(async (data) => ({
			customer: await decryptCustomer(data.customer),
			project: await decryptProject(data.project),
			task: await decryptTask(data.task),
		}))
	);
};
