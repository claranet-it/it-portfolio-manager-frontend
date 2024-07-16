import { $, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { t, tt } from 'src/locale/labels';
import { getCustomers } from 'src/services/customer';
import { getProjects } from 'src/services/projects';
import { deleteRegistry, editRegistry } from 'src/services/registry';
import { getTasks } from 'src/services/tasks';
import { RegistryHandler, showAlert } from 'src/utils/registry';

type Registry = {
	customer: Customer;
	projects: {
		projectName: Project;
		tasks: Task[];
	}[];
};

export const useRegistry = (alertMessageState: ModalState, editMessageState: ModalState) => {
	const loading = useSignal<boolean>(false);
	const data = useStore<Registry[]>([]);
	const trackValue = useSignal<unknown>();
	const prevValue = useSignal<string>('');
	const newValue = useSignal<string>('');

	const selectedCustomer = useSignal<Customer[]>([]);
	const selectedProject = useSignal<{ customer: Customer; project: Project }[]>([]);

	const setSelectedCustomer = $((customer: Customer) => {
		const isCustomerSelected = selectedCustomer.value.includes(customer);

		if (isCustomerSelected) {
			const customerIndex = data.findIndex((data) => data.customer === customer);

			data[customerIndex].projects.map((project) => {
				selectedProject.value = selectedProject.value.filter(
					(p) => p.project !== project.projectName
				);
			});
			selectedCustomer.value = selectedCustomer.value.filter((c) => c !== customer);
		} else {
			selectedCustomer.value = [...selectedCustomer.value, customer];
		}
	});

	const setSelectedProject = $((customer: Customer, project: Project) => {
		if (
			selectedProject.value.findIndex(
				(p) => p.project === project && p.customer === customer
			) !== -1
		) {
			selectedProject.value = selectedProject.value.filter((p) => p.project !== project);
		} else {
			selectedProject.value = [...selectedProject.value, { customer, project }];
		}
	});

	const fetchCustomers = $(async (props?: RegistryHandler) => {
		loading.value = true;
		const customers = await getCustomers();

		await new Promise<void>((resolve) => setTimeout(resolve, 500));

		/* ---------------------------------------- */
		/* TODO: think about this. */
		if (props && props.type !== 'customer') {
			selectedCustomer.value = [props.customer];
		} else {
			selectedCustomer.value = [];
		}

		if (props && props.type === 'task') {
			selectedProject.value = [
				{
					customer: props.customer,
					project: props.project,
				},
			];
		} else {
			selectedProject.value = [];
		}
		/* ---------------------------------------- */

		if (data.length !== 0) {
			data.splice(0, data.length);
		}

		customers.map((customer) => {
			data.push({
				customer,
				projects: [],
			});
		});
		loading.value = false;
	});

	const fetchProjects = $(async () => {
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

			loading.value = true;

			const projects = await getProjects('it', lastCustomer);
			await new Promise<void>((resolve) => setTimeout(resolve, 500));

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

			loading.value = false;
		}
	});

	const fetchTasks = $(async () => {
		await new Promise<void>((resolve) => setTimeout(resolve, 500));

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
			loading.value = true;

			const tasks = await getTasks('it', lastProject.customer, lastProject.project);
			data[customerIndex].projects[projectIndex].tasks = tasks;

			loading.value = false;
		}
	});

	useVisibleTask$(async ({ track }) => {
		track(() => trackValue.value);
		await fetchCustomers();
	});

	useVisibleTask$(async ({ track }) => {
		track(() => selectedCustomer.value);
		await fetchProjects();
	});

	useVisibleTask$(async ({ track }) => {
		track(() => selectedProject.value);
		await fetchTasks();
	});

	const handleEdit = $((props: RegistryHandler) => {
		prevValue.value =
			props.type == 'customer'
				? props.customer
				: props.type == 'project'
					? props.project
					: props.task;

		showAlert(
			{
				isVisible: true,
				title: tt('REGISTRY_EDIT_TITLE', { type: props.type }),
			},
			editMessageState,
			$(async () => {
				loading.value = true;
				await editRegistry(props, newValue.value);
				loading.value = false;
				await fetchCustomers(props);
			})
		);
		editMessageState.body = true;
	});

	const handleDelete = $((props: RegistryHandler) => {
		showAlert(
			{
				isVisible: true,
				title: t('REGISTRY_DELETE_TITLE'),
				message: tt('REGISTRY_DELETE_MESSAGE', {
					type: props.type,
					value:
						props.type == 'customer'
							? props.customer
							: props.type == 'project'
								? props.project
								: props.task,
				}),
			},
			alertMessageState,
			$(async () => {
				loading.value = true;
				await deleteRegistry(props);
				loading.value = false;
				await fetchCustomers(props);
			})
		);
	});

	return {
		data,
		loading,
		trackValue,
		selected: {
			getCustomer: selectedCustomer,
			setCustomer: setSelectedCustomer,
			getProject: selectedProject,
			setProject: setSelectedProject,
		},
		handlers: {
			delete: handleDelete,
			edit: handleEdit,
			editValues: {
				prevValue,
				newValue,
			},
		},
	};
};
