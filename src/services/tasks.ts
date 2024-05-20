import { getHttpResponse } from '../network/httpRequest';
import { Customer, Project, Task } from '../models/Month';

export const getTasks = async (
	company: string = 'it',
	customer: Customer,
	project: Project
): Promise<Task[]> =>
	getHttpResponse<Task[]>(`task/task?company=${company}&customer=${customer}&project=${project}`);
