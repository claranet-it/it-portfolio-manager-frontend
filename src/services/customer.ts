import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getCustomers = async (hideCompleted?: boolean): Promise<Customer[]> =>
	getHttpResponse<Customer[]>({
		path: `task/customer`,
		params: {
			...(hideCompleted !== undefined &&
				hideCompleted !== false && {
					completed: 'false',
				}),
		},
	});

export const editCustomer = async (
	customer: Customer,
	editedCustomer: Customer,
	project: Project
) =>
	checkHttpResponseStatus('task/customer-project', 200, 'PUT', {
		customer: customer,
		newCustomer: editedCustomer,
		project: project,
	});

export const deleteCustomer = async (customer: Customer, project: Project) =>
	checkHttpResponseStatus('task/customer-project', 200, 'DELETE', {
		customer: customer,
		project: project.name,
		inactive: true,
	});
