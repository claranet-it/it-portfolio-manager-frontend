import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { getHttpResponse } from '../network/httpRequest';

export const getProjects = async (company: string = 'it', customer: Customer): Promise<Project[]> =>
	getHttpResponse<Project[]>({
		path: `task/project`,
		params: {
			company,
			customer,
		},
	});
