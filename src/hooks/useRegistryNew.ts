import { $, useContext } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { AppContext } from 'src/app';
import { getProjects } from 'src/services/projects';
import { getTasks } from 'src/services/tasks';
import { useNotification } from './useNotification';

// type Registry = {
// 	customer: Customer;
// 	projects: {
// 		projectName: Project;
// 		tasks: Task[];
// 	}[];
// };

export const useRegistryNew = () => {
	const { addEvent } = useNotification();
	const appStore = useContext(AppContext);

	// const fetchCustomers = $(async (props?: RegistryHandler) => {
	// 	await setLoading('customers');
	// 	const customers = await getCustomers();

	// 	selectedCustomer.value =
	// 		props && props.type !== 'customer' && customers.find((c) => c === props.customer)
	// 			? [props.customer]
	// 			: [];

	// 	selectedProject.value = [];

	// 	if (data.length !== 0) {
	// 		data.splice(0, data.length);
	// 	}

	// 	customers.map((customer) => {
	// 		data.push({
	// 			customer,
	// 			projects: [],
	// 		});
	// 	});

	// 	await setLoading('customers');
	// });

	const fetchProjects = $(async (customer?: Customer, project?: Project) => {
		if (selectedCustomer.value.length == 0) {
			return;
		}

		const lastCustomer = selectedCustomer.value[selectedCustomer.value.length - 1];

		if (selectedCustomer.value) {
			const index = data.findIndex(
				(registry) =>
					registry.customer == selectedCustomer.value[selectedCustomer.value.length - 1]
			);

			if (data[index].projects.length > 0) {
				return;
			}

			await setLoading('projects');

			const projects = await getProjects('it', lastCustomer);

			const lastCustomerIndex = data.findIndex(
				(registry) => registry.customer == lastCustomer
			);

			if (data[lastCustomerIndex].projects.length > 0) {
				data[lastCustomerIndex].projects.splice(0, data[lastCustomerIndex].projects.length);
			}
			projects.map((project) => {
				data[lastCustomerIndex].projects.push({
					projectName: project,
					tasks: [],
				});
			});

			await setLoading('projects');
			if (project && customer) {
				selectedProject.value = [{ customer: customer, project: project }];
			}
		}
	});

	const fetchTasks = $(async () => {
		if (selectedCustomer.value.length == 0 || selectedProject.value.length == 0) {
			return;
		}

		const lastProject = selectedProject.value[selectedProject.value.length - 1];

		const getCustomerAndProjectIndices = () => {
			const customerIndex = data.findIndex(
				(registry) => registry.customer === lastProject.customer
			);
			const projectIndex =
				customerIndex !== -1
					? data[customerIndex].projects.findIndex(
							(project) => project.projectName === lastProject.project
						)
					: -1;

			return { customerIndex, projectIndex };
		};

		let { customerIndex, projectIndex } = getCustomerAndProjectIndices();

		if (customerIndex === -1 || projectIndex === -1) {
			await fetchProjects();
			({ customerIndex, projectIndex } = getCustomerAndProjectIndices());
		}

		if (customerIndex !== -1 && projectIndex !== -1) {
			await setLoading('tasks');

			const tasks = await getTasks('it', lastProject.customer, lastProject.project);
			data[customerIndex].projects[projectIndex].tasks = tasks;

			await setLoading('tasks');
		}
	});

	return {};
};
