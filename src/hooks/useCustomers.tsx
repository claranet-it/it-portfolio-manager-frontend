import { $, useContext, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { AppContext } from 'src/app';
import { deleteCustomer, editCustomer, getCustomers } from 'src/services/customer';
import { getProjects } from 'src/services/projects';

export const useCustomers = () => {
	const appStore = useContext(AppContext);

	const isLoading = useSignal<Boolean>(false);
	const customers = useSignal<Customer[]>([]);

	const fetchCustomers = $(async () => {
		customers.value = [];
		isLoading.value = true;
		customers.value = await getCustomers();
		isLoading.value = false;
	});

	const updateProjectCustomer = $(
		async (customer: Customer, editedCusteomr: Customer, project: Project) => {
			const response = await editCustomer(customer, editedCusteomr, project);
			return response;
		}
	);

	const updateCustomer = $(async (customer: Customer, editedCusteomr: Customer) => {
		appStore.isLoading = true;
		const projectList = await getProjects('it', customer);
		projectList.forEach(
			async (project) => await updateProjectCustomer(customer, editedCusteomr, project)
		);
		appStore.isLoading = false;
		return true;
	});

	const removeProjectCustomer = $(async (customer: Customer, project: Project) => {
		const response = await deleteCustomer(customer, project);
		return response;
	});

	const removeCustomer = $(async (customer: Customer) => {
		appStore.isLoading = true;
		const projectList = await getProjects('it', customer);
		projectList.forEach(async (project) => await removeProjectCustomer(customer, project));
		appStore.isLoading = false;
		return true;
	});

	return { customers, isLoading, fetchCustomers, updateCustomer, removeCustomer };
};
