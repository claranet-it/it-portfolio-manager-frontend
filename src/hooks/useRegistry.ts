import { $, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { t, tt } from 'src/locale/labels';
import { getCustomers } from 'src/services/customer';
import { getProjects } from 'src/services/projects';
import { deleteProject, editRegistry, RegistryResponse } from 'src/services/registry';
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

	const editValuesReset = $(() => {
		prevValue.value = '';
		newValue.value = '';
	});

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

		selectedCustomer.value =
			props && props.type !== 'customer' && customers.find((c) => c === props.customer)
				? [props.customer]
				: [];

		selectedProject.value = [];

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

	const handleCustomerEdit = $(async (props: RegistryHandler, newCustomer: string) => {
		await setLoading('edit');
		const customerIndex = data.findIndex((registry) => registry.customer == props.customer);
		let projectCount = data[customerIndex].projects.length;
		let projects = [];

		if (projectCount === 0) {
			projects = await getProjects('it', props.customer);
		} else {
			projects = data[customerIndex].projects.map((project) => project.projectName);
		}

		projectCount = projects.length;

		const results = {
			success: 0,
			failure: 0,
		};

		try {
			for (let i = 0; i <= projectCount - 1; i++) {
				const res = await editRegistry(props, newCustomer, projects[i]);
				if (res.message === 'OK') {
					results.success++;
				} else {
					results.failure++;
				}
			}

			if (results.success === 0 && results.failure !== 0) {
				addEvent({
					type: 'danger',
					message: tt('REGISTRY_CUSTOMER_EDIT_FAILURE_MESSAGE', {
						fail: results.failure.toString(),
						total: projectCount.toString(),
					}),
					autoclose: true,
				});
			} else if (results.success !== 0 && results.failure === 0) {
				addEvent({
					type: 'success',
					message: tt('REGISTRY_CUSTOMER_EDIT_SUCCESS_MESSAGE', {
						success: results.success.toString(),
						total: projectCount.toString(),
					}),
					autoclose: true,
				});
			} else if (results.success !== 0 && results.failure !== 0) {
				addEvent({
					type: 'success',
					message: tt('REGISTRY_CUSTOMER_EDIT_PARTIAL_MESSAGE', {
						success: results.success.toString(),
						fail: results.failure.toString(),
					}),
					autoclose: true,
				});
			}

			await editValuesReset();
			await setLoading('edit');

			await fetchCustomers(props);
		} catch (e) {
			addEvent({
				type: 'danger',
				message: t('REGISTRY_CUSTOMER_EDIT_ERROR_MESSAGE'),
				autoclose: true,
			});
			await editValuesReset();
			await setLoading('edit');
		}
	});

	const handleEdit = $((props: RegistryHandler) => {
		prevValue.value =
			props.type == 'customer'
				? props.customer
				: props.type == 'project'
					? props.project
					: props.task;

		showAlert(
			props.type === 'customer' ? 'EDIT_CUSTOMER' : 'EDIT',
			props,
			editMessageState,
			$(async () => {
				let result: RegistryResponse;
				if (props.type == 'customer') {
					await handleCustomerEdit(props, newValue.value);
				} else {
					await setLoading('edit');
					result = await editRegistry(props, newValue.value);

					if (result.message === 'OK') {
						addEvent({
							type: 'success',
							message: tt('EDIT_REGISTRY_ELEMENT_SUCCESS_MESSAGE', {
								type: capitalizeFirstLetter(props.type),
							}),
							autoclose: true,
						});
						await editValuesReset();
						await setLoading('edit');

						await fetchCustomers(props);

						if (props.type === 'task') {
							await fetchProjects(props.customer, props.project);
						}
					} else {
						addEvent({
							type: 'danger',
							message: result.message,
							autoclose: true,
						});
						await editValuesReset();
						await setLoading('edit');
					}
				}
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
