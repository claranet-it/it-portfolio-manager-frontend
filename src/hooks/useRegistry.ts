import { $, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { tt } from 'src/locale/labels';
import { getCustomers } from 'src/services/customer';
import { getProjects } from 'src/services/projects';
import { deleteProject, editRegistry } from 'src/services/registry';
import { getTasks } from 'src/services/tasks';
import { capitalizeFirstLetter, RegistryHandler, showAlert } from 'src/utils/registry';
import { useNotification } from './useNotification';

type Registry = {
	customer: Customer;
	projects: {
		projectName: Project;
		tasks: Task[];
	}[];
};

export const useRegistry = (alertMessageState: ModalState, editMessageState: ModalState) => {
	const { addEvent } = useNotification();

	const loadingList = useSignal<string[]>([]);
	const data = useStore<Registry[]>([]);
	const trackValue = useSignal<unknown>();
	const prevValue = useSignal<string>('');
	const newValue = useSignal<string>('');

	const selectedCustomer = useSignal<Customer[]>([]);
	const selectedProject = useSignal<{ customer: Customer; project: Project }[]>([]);

	const setLoading = $((value: string) => {
		if (loadingList.value.includes(value)) {
			loadingList.value = loadingList.value.filter((loadingValue) => loadingValue !== value);
		} else {
			loadingList.value = [...loadingList.value, value];
		}
	});

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
		await setLoading('customers');
		const customers = await getCustomers();

		if (props) {
			selectedCustomer.value =
				props.type !== 'customer' && customers.find((c) => c === props.customer)
					? [props.customer]
					: [];
			selectedProject.value =
				props.type === 'task' ? [{ customer: props.customer, project: props.project }] : [];
		} else {
			selectedCustomer.value = [];
			selectedProject.value = [];
		}

		if (data.length !== 0) {
			data.splice(0, data.length);
		}

		customers.map((customer) => {
			data.push({
				customer,
				projects: [],
			});
		});

		await setLoading('customers');
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
			'EDIT',
			props,
			editMessageState,
			$(async () => {
				await setLoading('edit');
				const result = await editRegistry(props, newValue.value);

				if (result.message === 'OK') {
					addEvent({
						type: 'success',
						message: tt('EDIT_REGISTRY_ELEMENT_SUCCESS_MESSAGE', {
							type: capitalizeFirstLetter(props.type),
						}),
						autoclose: true,
					});
					newValue.value = '';
					await setLoading('edit');

					await fetchCustomers(props);
					return;
				} else {
					addEvent({
						type: 'danger',
						message: result.message,
						autoclose: true,
					});
				}
				await setLoading('edit');
			})
		);
		editMessageState.body = true;
	});

	const handleDelete = $((props: RegistryHandler) => {
		if (props.type !== 'project') {
			return;
		}

		showAlert(
			'DELETE',
			props,
			alertMessageState,
			$(async () => {
				await setLoading('delete');
				const result = await deleteProject(props.customer, props.project);
				if (result.message === 'OK') {
					addEvent({
						type: 'success',
						message: tt('DELETE_REGISTRY_ELEMENT_SUCCESS_MESSAGE', {
							type: capitalizeFirstLetter(props.type),
						}),
						autoclose: true,
					});

					await setLoading('delete');
					await fetchCustomers(props);

					return;
				} else {
					addEvent({
						type: 'danger',
						message: result.message,
						autoclose: true,
					});
				}

				await setLoading('delete');
			})
		);
	});

	return {
		data,
		loading: loadingList.value.length !== 0,
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
