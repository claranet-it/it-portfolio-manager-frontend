import { $, Signal, useContext, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { AppContext } from 'src/app';
import { deleteCustomer, editCustomer, getCustomers } from 'src/services/customer';
import { getProjects } from 'src/services/projects';

export const useCustomers = (hideCompleted?: Signal<boolean>) => {
	const appStore = useContext(AppContext);

	const customers = useSignal<Customer[]>([]);

	const fetchCustomers = $(async () => {
		customers.value = [];
		appStore.isLoading = true;
		customers.value = await getCustomers(hideCompleted?.value);
		appStore.isLoading = false;
	});

	const updateProjectCustomer = $(
		async (customer: Customer, editedCustomerName: string, project: Project) => {
			const response = await editCustomer(
				customer,
				{
					id: customer.id,
					name: editedCustomerName,
				},
				project
			);
			return response;
		}
	);

	const updateCustomer = $(async (customer: Customer, editedCustomerName: string) => {
		appStore.isLoading = true;
		const projectList = await getProjects(customer);
		const results = projectList.map(async (project) => {
			return await updateProjectCustomer(customer, editedCustomerName, project);
		});
		appStore.isLoading = false;
		return results.includes(Promise.resolve(false));
	});

	const removeProjectCustomer = $(async (customer: Customer, project: Project) => {
		const response = await deleteCustomer(customer, project);
		return response;
	});

	const removeCustomer = $(async (customer: Customer) => {
		appStore.isLoading = true;
		const projectList = await getProjects(customer);
		const results = projectList.map(async (project) => {
			return await removeProjectCustomer(customer, project);
		});
		appStore.isLoading = false;
		return results.includes(Promise.resolve(false));
	});

	return { customers, fetchCustomers, updateCustomer, removeCustomer };
};
