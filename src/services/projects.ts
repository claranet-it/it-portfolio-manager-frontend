import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getProjects = async (
	customer: Customer,
	hideCompleted?: boolean
): Promise<Project[]> =>
	getHttpResponse<Project[]>({
		path: `task/project`,
		params: {
			customer: customer.id,
			...(hideCompleted !== undefined &&
				hideCompleted !== false && {
					completed: 'false',
				}),
		},
	});

export const deleteProject = async (customer: Customer, project: Project) =>
	checkHttpResponseStatus('task/customer-project', 200, 'DELETE', {
		customer: customer.id,
		project: project.id,
		inactive: true,
	});

export const editProject = async (customer: Customer, oldProject: Project, newProject: Project) =>
	checkHttpResponseStatus('task/customer-project', 200, 'PUT', {
		customer: customer.id,
		project: oldProject.id,
		newProject: newProject,
	});
