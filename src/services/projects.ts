import { Customer } from '@models/Customer';
import { Project } from '@models/Project';
import { getHttpResponse } from '../network/httpRequest';

export const getProjects = async (company: string = 'it', customer: Customer): Promise<Project[]> =>
	getHttpResponse<Project[]>(`task/project?company=${company}&customer=${customer}`);
