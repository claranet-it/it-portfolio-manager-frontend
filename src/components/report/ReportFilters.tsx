import { $, Signal, component$, sync$, useComputed$, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { UserProfile } from '@models/user';
import { t } from 'src/locale/labels';
import { getProjects } from 'src/services/projects';
import { getAllTasks, getTasks } from 'src/services/tasks';
import { getUserProfiles } from 'src/services/user';
import { UUID } from 'src/utils/uuid';
import { Button } from '../Button';
import { Multiselect } from '../form/Multiselect';

export const ReportFilters = component$<{
	selectedCustomers: Signal<Customer[]>;
	selectedProjects: Signal<Project[]>;
	selectedTasks: Signal<Task[]>;
	selectedUsers: Signal<UserProfile[]>;
}>(({ selectedCustomers, selectedProjects, selectedTasks, selectedUsers }) => {
	const getUniqueValues = sync$((arr: string[]): string[] => {
		return [...new Set(arr)];
	});

	const _selectedProjects = useSignal(selectedProjects.value.map((project) => project.name));
	const _selectedTasks = useSignal(selectedTasks.value.map((task) => task.name));
	const _selectedUsers = useSignal(selectedUsers.value.map((user) => user.name));

	const taskProjectCustomerSig = useComputed$(async () => {
		return await getAllTasks();
	});

	const usersSig = useComputed$(async () => {
		return await getUserProfiles();
	});

	const _usersOptionsSig = useComputed$(async () => {
		return usersSig.value.map((user) => user.name);
	});

	const customerOptionsSig = useComputed$(async () => {
		return getUniqueValues(
			taskProjectCustomerSig.value.map((taskProjectCustomer) => taskProjectCustomer.customer)
		);
	});

	const _projectOptionsSig = useComputed$(async () => {
		let customerProjects;

		if (selectedCustomers.value.length !== 0) {
			customerProjects = taskProjectCustomerSig.value.filter(
				(element) =>
					selectedCustomers.value.includes(element.customer) &&
					customerOptionsSig.value.includes(element.customer)
			);
		} else {
			customerProjects = taskProjectCustomerSig.value;
		}

		return getUniqueValues(
			customerProjects.map((taskProjectCustomer) => taskProjectCustomer.project)
		);
	});

	const _taskOptionsSig = useComputed$(async () => {
		let taskProjects;

		if (selectedProjects.value.length !== 0) {
			const projectNames = selectedProjects.value.map((project) => project.name);
			taskProjects = taskProjectCustomerSig.value.filter(
				(element) =>
					projectNames.includes(element.project) &&
					_projectOptionsSig.value.includes(element.project)
			);
		} else {
			taskProjects = taskProjectCustomerSig.value;
		}

		return taskProjects.map((taskProjectCustomer) => taskProjectCustomer.task);
	});

	const getProjectSig = $(async (project: string) => {
		const customer = taskProjectCustomerSig.value.find(
			(value) => value.project === project
		)?.customer;
		if (customer) {
			const customerProjectList = await getProjects(customer);
			return customerProjectList.find((element) => element.name === project);
		}
	});

	const getTaskSig = $(async (task: string) => {
		const project = taskProjectCustomerSig.value.find((value) => value.task === task)?.project;
		const customer = taskProjectCustomerSig.value.find(
			(value) => value.project === project
		)?.customer;
		if (customer && project) {
			const projectTaskList = await getTasks(customer, project);
			return projectTaskList.find((element) => element.name === task);
		}
	});

	const onChangeTask = $(async () => {
		const selectedTaskNames = selectedTasks.value.map((task) => task.name);
		const tasksToAdd = _selectedTasks.value.filter(
			(taskName) => !selectedTaskNames.includes(taskName)
		);

		if (tasksToAdd.length > 0) {
			for (const taskName of tasksToAdd) {
				const task = await getTaskSig(taskName);
				selectedTasks.value = [
					...selectedTasks.value,
					task ?? { name: taskName, completed: false, plannedHours: 0 },
				];
			}
		} else {
			const tasksToRemove = selectedTasks.value
				.filter((task) => !_selectedTasks.value.includes(task.name))
				.map((task) => task.name);

			selectedTasks.value = selectedTasks.value.filter(
				(task) => !tasksToRemove.includes(task.name)
			);
		}
	});

	const onChangeProject = $(async () => {
		const selectedProjectNames = selectedProjects.value.map((proj) => proj.name);
		const projectsToAdd = _selectedProjects.value.filter(
			(projName) => !selectedProjectNames.includes(projName)
		);

		if (projectsToAdd.length > 0) {
			for (const projName of projectsToAdd) {
				const project = await getProjectSig(projName);
				selectedProjects.value = [
					...selectedProjects.value,
					project ?? { name: projName, type: '', plannedHours: 0 },
				];
			}
		} else {
			const projectsToRemove = selectedProjects.value
				.filter((proj) => !_selectedProjects.value.includes(proj.name))
				.map((proj) => proj.name);

			selectedProjects.value = selectedProjects.value.filter(
				(proj) => !projectsToRemove.includes(proj.name)
			);
		}
	});

	const onChangeUser = $(() => {
		selectedUsers.value = _selectedUsers.value.map((user) => {
			const value = usersSig.value.find((element) => element.name === user);
			return (
				value ?? {
					name: user,
					email: '',
					id: '',
				}
			);
		});
	});

	const clearFilters = $(() => {
		selectedCustomers.value = [];
		_selectedProjects.value = [];
		_selectedTasks.value = [];
		_selectedUsers.value = [];
	});

	return (
		<div class='m-0 flex w-full gap-1 justify-self-start sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
			<Multiselect
				id={UUID() + '-filter-customer'}
				label={t('CUSTOMER_LABEL')}
				placeholder={t('select_empty_label')}
				value={selectedCustomers}
				options={customerOptionsSig}
				allowSelectAll
			/>

			<Multiselect
				id={UUID() + '-filter-project'}
				label={t('PROJECT_LABEL')}
				placeholder={t('select_empty_label')}
				value={_selectedProjects}
				options={_projectOptionsSig}
				onChange$={onChangeProject}
				allowSelectAll
			/>

			<Multiselect
				id={UUID() + '-filter-task'}
				label={t('TASK_LABEL')}
				placeholder={t('select_empty_label')}
				value={_selectedTasks}
				options={_taskOptionsSig}
				onChange$={onChangeTask}
				allowSelectAll
			/>

			<Multiselect
				id={UUID() + '-filter-user'}
				label={t('name_label')}
				placeholder={t('select_empty_label')}
				value={_selectedUsers}
				options={_usersOptionsSig}
				onChange$={onChangeUser}
				allowSelectAll
			/>

			<div class='flex items-end'>
				<Button variant={'outline'} size={'small'} onClick$={clearFilters}>
					Clear filters
				</Button>
			</div>
		</div>
	);
});
