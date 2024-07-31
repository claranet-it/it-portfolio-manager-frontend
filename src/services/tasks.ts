import { Customer } from '@models/customer';
import { Project, ProjectType } from '@models/project';
import { Task } from '@models/task';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getTasks = async (
	company: string = 'it',
	customer: Customer,
	project: Project
): Promise<Task[]> =>
	getHttpResponse<Task[]>(
		`task/task?company=${encodeURIComponent(company)}&customer=${encodeURIComponent(customer)}&project=${encodeURIComponent(project)}`
	);

export const saveTask = async (
	company: string = 'it',
	customer: Customer,
	project: Project,
	task: Task,
	projectType?: ProjectType
): Promise<boolean> =>
	checkHttpResponseStatus(`task/task`, 200, 'POST', {
		company: company,
		customer: customer,
		project: project,
		task: task,
		projectType: projectType,
	});
