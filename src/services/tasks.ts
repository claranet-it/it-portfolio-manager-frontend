import { Task } from 'vitest';
import { Customer } from '../models/customer';
import { Project } from '../models/project';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getTasks = async (
	company: string = 'it',
	customer: Customer,
	project: Project
): Promise<Task[]> =>
	getHttpResponse<Task[]>(`task/task?company=${company}&customer=${customer}&project=${project}`);
