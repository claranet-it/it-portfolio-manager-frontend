import { $, Signal, component$, useComputed$, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { t } from 'src/locale/labels';
import { getCustomers } from 'src/services/customer';
import { getProjects } from 'src/services/projects';
import { getTasks } from 'src/services/tasks';
import { INIT_PROJECT_VALUE } from 'src/utils/constants';
import { Button } from '../Button';
import { Input } from '../form/Input';
import { Select } from '../form/Select';

export const ReportFilters = component$<{
	selectedCustomer: Signal<Customer>;
	selectedProject: Signal<Project>;
	selectedTask: Signal<Task>;
	selectedName: Signal<string>;
}>(({ selectedCustomer, selectedProject, selectedTask, selectedName }) => {
	const customerSig = useComputed$(async () => {
		return await getCustomers();
	});

	const _projectSelected = useSignal(selectedProject.value.name);
	const _taskSelected = useSignal(selectedTask.value.name);

	const _projectSig = useComputed$(async () => {
		return selectedCustomer.value != ''
			? (await getProjects(selectedCustomer.value)).map((project) => project.name)
			: [];
	});

	const projectSig = useComputed$(async () => {
		return selectedCustomer.value != '' ? await getProjects(selectedCustomer.value) : [];
	});

	const onChangeCustomer = $(() => {
		_projectSelected.value = '';
		selectedProject.value = INIT_PROJECT_VALUE;
		_taskSelected.value == '';
	});

	const onChangeProject = $(() => {
		if (projectSig.value.length > 0) {
			const result = projectSig.value.find(
				(project) => project.name === _projectSelected.value
			)!;

			if (result) selectedProject.value = result;
		}

		_taskSelected.value = '';
	});

	const taskSig = useComputed$(async () => {
		return _projectSelected.value != ''
			? await getTasks(selectedCustomer.value, selectedProject.value)
			: [];
	});

	const _taskSig = useComputed$(async () => {
		return _projectSelected.value != ''
			? (await getTasks(selectedCustomer.value, selectedProject.value)).map(
					(task) => task.name
				)
			: [];
	});

	const onChangeTask = $(() => {
		if (taskSig.value.length > 0) {
			const result = taskSig.value.find((task) => task.name === _taskSelected.value)!;

			if (result) {
				selectedTask.value = result;
			} else {
				selectedTask.value = {
					name: '',
					completed: false,
					plannedHours: 0,
				};
			}
		}
	});

	const clearFilters = $(() => {
		selectedCustomer.value = '';
		selectedProject.value = INIT_PROJECT_VALUE;
		_taskSelected.value = '';
		selectedName.value = '';
	});

	return (
		<div class='m-0 flex w-full gap-1 justify-self-start sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
			<Select
				id='filer-customer'
				label={t('CUSTOMER_LABEL')}
				placeholder={t('select_empty_label')}
				value={selectedCustomer}
				options={customerSig}
				onChange$={onChangeCustomer}
			/>

			<Select
				id='filter-project'
				label={t('PROJECT_LABEL')}
				placeholder={t('select_empty_label')}
				value={_projectSelected}
				options={_projectSig}
				disabled={!selectedCustomer.value}
				onChange$={onChangeProject}
			/>

			<Select
				id='filter-task'
				label={t('TASK_LABEL')}
				placeholder={t('select_empty_label')}
				disabled={_projectSelected.value === ''}
				value={_taskSelected}
				options={_taskSig}
				onChange$={onChangeTask}
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
