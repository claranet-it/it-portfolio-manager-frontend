import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task, TaskProjectCustomer } from '@models/task';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getTasks = async (
	customer: Customer,
	project: Project | string,
	hideCompleted?: boolean
): Promise<Task[]> =>
	getHttpResponse<Task[]>({
		path: `task/task`,
		params: {
			customer,
			project: typeof project === 'string' ? project : project.name,
			...(hideCompleted !== undefined &&
				hideCompleted !== false && {
					completed: 'false',
				}),
		},
	});

export const saveTask = async (
	customer: Customer,
	project: Project,
	task: string,
	index?: number
): Promise<boolean> =>
	checkHttpResponseStatus(`task/task`, 200, 'POST', {
		customer: customer,
		project: project,
		task: task,
		index: index,
	});

export const editTaskName = async (
	customer: Customer,
	project: Project,
	task: string,
	newTaskName: string
) =>
	checkHttpResponseStatus('task/task', 200, 'PUT', {
		customer: customer,
		project: project.name,
		task: task,
		newTask: newTaskName,
	});

export const editTask = async (
	customer: Customer,
	project: Project,
	task: string,
	completed: boolean,
	plannedHours: number
) =>
	checkHttpResponseStatus('task/task-properties', 200, 'POST', {
		customer: customer,
		project: project.name,
		task: task,
		completed: completed,
		plannedHours: plannedHours,
	});

export const getAllTasks = async (): Promise<TaskProjectCustomer[]> =>
	getHttpResponse<TaskProjectCustomer[]>({
		path: 'task/task-list',
	});
