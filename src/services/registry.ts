import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { getHttpResponse } from 'src/network/httpRequest';
import { RegistryHandler } from 'src/utils/registry';

type RegistryResponse = {
	message: string;
};

export const editRegistry = async (
	props: RegistryHandler,
	newValue: string
): Promise<RegistryResponse> => {
	if (props.type === 'task') {
		return getHttpResponse<RegistryResponse>('task/task', 'PUT', {
			customer: props.customer,
			project: props.project,
			task: props.task,
			newTask: newValue,
		});
	} else if (props.type === 'project') {
		return getHttpResponse<RegistryResponse>('task/customer-project', 'PUT', {
			customer: props.customer,
			project: props.project,
			newProject: newValue,
		});
	} else {
		return getHttpResponse<RegistryResponse>('task/customer-project', 'PUT', {
			customer: props.customer,
			newCustomer: newValue,
		});
	}
};

export const deleteProject = async (
	customer: Customer,
	project: Project
): Promise<RegistryResponse> => {
	return getHttpResponse<RegistryResponse>('task/customer-project', 'DELETE', {
		customer: customer,
		project: project,
		inactive: true,
	});
};
