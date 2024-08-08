import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getProjects = async (company: string = 'it', customer: Customer): Promise<Project[]> =>
	getHttpResponse<Project[]>({
		path: `task/project`,
		params: {
			company,
			customer,
		},
	});

export const deleteProject = async (customer: Customer, project: Project) =>
	checkHttpResponseStatus('task/customer-project', 200, 'DELETE', {
		customer: customer,
		project: project.name,
		inactive: true,
	});

export const editProject = async (customer: Customer, oldProject: Project, newProject: Project) =>
	checkHttpResponseStatus('task/customer-project', 200, 'PUT', {
		customer: customer,
		project: oldProject,
		newProject: newProject,
	});
