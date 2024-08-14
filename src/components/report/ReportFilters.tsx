import { Signal, component$, useComputed$, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { t } from 'src/locale/labels';
import { getCustomers } from 'src/services/customer';
import { getProjects } from 'src/services/projects';
import { getTasks } from 'src/services/tasks';
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

	const projectSig = useComputed$(async () => {
		return selectedCustomer.value != ''
			? (await getProjects('it', selectedCustomer.value)).map((project) => project.name)
			: [];
	});

	const taskSig = useComputed$(async () => {
		return selectedProject.value.name != ''
			? await getTasks('it', selectedCustomer.value, selectedProject.value)
			: [];
	});

	return (
		<div class='w-full flex sm:flex-col m-0 justify-self-start sm:space-y-2 md:space-x-2 lg:space-x-2'>
			<Select
				id='filer-customer'
				label={t('CUSTOMER_LABEL')}
				placeholder={t('select_empty_label')}
				value={selectedCustomer}
				options={customerSig}
				onChange$={() => {
					_projectSelected.value = '';
				}}
			/>

			<Select
				id='filter-project'
				label={t('PROJECT_LABEL')}
				placeholder={t('select_empty_label')}
				value={_projectSelected}
				options={projectSig}
				disabled={!selectedCustomer.value}
				onChange$={() => {
					selectedTask.value = '';
				}}
			/>

			<Select
				id='filter-task'
				label={t('TASK_LABEL')}
				placeholder={t('select_empty_label')}
				disabled={!selectedProject.value}
				value={selectedTask}
				options={taskSig}
			/>

			<Input
				id='filter-name'
				label={t('name_label')}
				bindValue={selectedName}
				placeholder={t('input_empty_label')}
			/>
		</div>
	);
});
