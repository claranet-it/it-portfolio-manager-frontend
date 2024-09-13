import { $, Signal, component$, sync$, useComputed$, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { t } from 'src/locale/labels';
import { getAllTasks } from 'src/services/tasks';
import { UUID } from 'src/utils/uuid';
import { Button } from '../Button';
import { Input } from '../form/Input';
import { Multiselect } from '../form/Multiselect';

export const ReportFilters = component$<{
	selectedCustomer: Signal<Customer[]>;
	selectedProject: Signal<Project[]>;
	selectedTask: Signal<Task[]>;
	selectedName: Signal<string>;
}>(({ selectedCustomer, selectedProject, selectedTask, selectedName }) => {
	const getUniqueValues = sync$((arr: string[]): string[] => {
		return [...new Set(arr)];
	});

	const _selectedProject = useSignal(selectedProject.value.map((project) => project.name));
	const _selectedTask = useSignal(selectedTask.value.map((task) => task.name));

	const taskProjectCustomerSig = useComputed$(async () => {
		return await getAllTasks();
	});

	const customerOptionsSig = useComputed$(async () => {
		return getUniqueValues(
			taskProjectCustomerSig.value.map((taskProjectCustomer) => taskProjectCustomer.customer)
		);
	});

	const _projectOptionsSig = useComputed$(async () => {
		let customerProjects;

		if (selectedCustomer.value.length !== 0) {
			customerProjects = taskProjectCustomerSig.value.filter(
				(element) =>
					selectedCustomer.value.includes(element.customer) &&
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

		if (selectedProject.value.length !== 0) {
			const projectNames = selectedProject.value.map((project) => project.name);
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

	const onChangeTask = $(() => {
		selectedTask.value = _selectedTask.value.map((task) => ({
			name: task,
			completed: false,
			plannedHours: 0,
		}));
	});

	const onChangeProject = $(() => {
		selectedProject.value = _selectedProject.value.map((project) => ({
			name: project,
			type: '',
			plannedHours: 0,
		}));
	});

	// TODO: use as base for task and project change
	// const onChangeTask = $(() => {
	// 	if (taskSig.value.length > 0) {
	// 		const result = taskSig.value.find((task) => task.name === _selectedTask.value)!;

	// 		if (result) {
	// 			selectedTask.value = result;
	// 		} else {
	// 			selectedTask.value = {
	// 				name: '',
	// 				completed: false,
	// 				plannedHours: 0,
	// 			};
	// 		}
	// 	}
	// });

	const clearFilters = $(() => {
		selectedCustomer.value = [];
		selectedProject.value = [];
		_selectedTask.value = [];
		selectedName.value = '';
	});

	return (
		<div class='m-0 flex w-full gap-1 justify-self-start sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
			<Multiselect
				id={UUID() + '-filter-customer'}
				label={t('CUSTOMER_LABEL')}
				placeholder={t('select_empty_label')}
				value={selectedCustomer}
				options={customerOptionsSig}
				allowSelectAll
			/>

			<Multiselect
				id={UUID() + '-filter-project'}
				label={t('PROJECT_LABEL')}
				placeholder={t('select_empty_label')}
				value={_selectedProject}
				options={_projectOptionsSig}
				onChange$={onChangeProject}
				allowSelectAll
			/>

			<Multiselect
				id={UUID() + '-filter-task'}
				label={t('TASK_LABEL')}
				placeholder={t('select_empty_label')}
				value={_selectedTask}
				options={_taskOptionsSig}
				onChange$={onChangeTask}
				allowSelectAll
			/>

			<Input
				id='filter-name'
				label={t('name_label')}
				bindValue={selectedName}
				placeholder={t('input_empty_label')}
			/>

			<div class='flex items-end'>
				<Button variant={'outline'} size={'small'} onClick$={clearFilters}>
					Clear filters
				</Button>
			</div>
		</div>
	);
});
