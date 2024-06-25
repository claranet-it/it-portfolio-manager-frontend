import { Signal, component$, useComputed$ } from '@builder.io/qwik';
import { getCustomers } from 'src/services/customer';
import { getProjects } from 'src/services/projects';
import { getTasks } from 'src/services/tasks';
import { t } from '../locale/labels';
import { Input } from './form/Input';
import { Select } from './form/Select';

export const ReportFilters = component$<{
	selectedCustomer: Signal<string>;
	selectedProject: Signal<string>;
	selectedTask: Signal<string>;
	selectedName: Signal<string>;
}>(({ selectedCustomer, selectedProject, selectedTask, selectedName }) => {
	const customerSig = useComputed$(async () => {
		return await getCustomers();
	});

	const projectSig = useComputed$(async () => {
		return selectedCustomer.value != '' ? await getProjects('it', selectedCustomer.value) : [];
	});

	const taskSig = useComputed$(async () => {
		return selectedProject.value != ''
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
					selectedProject.value = '';
				}}
			/>

			<Select
				id='filter-project'
				label={t('PROJECT_LABEL')}
				placeholder={t('select_empty_label')}
				value={selectedProject}
				options={projectSig}
				onChange$={() => {
					selectedTask.value = '';
				}}
			/>

			<Select
				id='filter-task'
				label={t('TASK_LABEL')}
				placeholder={t('select_empty_label')}
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
