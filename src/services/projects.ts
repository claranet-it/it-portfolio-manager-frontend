import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { decryptProject, encryptCustomer, encryptProject } from 'src/utils/cipher-entities';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getProjects = async (
	customer: Customer,
	hideCompleted?: boolean
): Promise<Project[]> => {
	const response = await getHttpResponse<Project[]>({
		path: `task/project`,
		params: {
			customer: await encryptCustomer(customer),
			...(hideCompleted !== undefined &&
				hideCompleted !== false && {
					completed: 'false',
				}),
		},
	});

	return Promise.all(response.map(decryptProject));
};

export const deleteProject = async (customer: Customer, project: Project) =>
	checkHttpResponseStatus('task/customer-project', 200, 'DELETE', {
		customer: await encryptCustomer(customer),
		project: (await encryptProject(project)).name,
		inactive: true,
	});

export const editProject = async (customer: Customer, oldProject: Project, newProject: Project) =>
	checkHttpResponseStatus('task/customer-project', 200, 'PUT', {
		customer: await encryptCustomer(customer),
		project: await encryptProject(oldProject),
		newProject: await encryptProject(newProject),
	});
