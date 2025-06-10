import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { decryptCustomer, encryptCustomer } from 'src/utils/cipher-entities';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getCustomers = async (hideCompleted?: boolean): Promise<Customer[]> => {
	const response = await getHttpResponse<Customer[]>({
		path: `task/customer`,
		params: {
			...(hideCompleted !== undefined &&
				hideCompleted !== false && {
					completed: 'false',
				}),
		},
	});

	return await Promise.all(response.map(decryptCustomer));
};

export const editCustomer = async (
	customer: Customer,
	editedCustomer: Customer,
	project: Project
) =>
	checkHttpResponseStatus('task/customer-project', 200, 'PUT', {
		customer: customer.id,
		project: project.id,
		newCustomer: (await encryptCustomer(editedCustomer)).name,
	});

export const deleteCustomer = async (customer: Customer, project: Project) =>
	checkHttpResponseStatus('task/customer-project', 200, 'DELETE', {
		customer: customer.id,
		project: project.id,
		inactive: true,
	});
