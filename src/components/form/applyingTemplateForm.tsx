import { $, component$, useSignal, useTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { t } from 'src/locale/labels';
import { getTasks } from 'src/services/tasks';
import { UUID } from 'src/utils/uuid';
import { Select } from './Select';

interface Props {
	formGroup: { customer: Customer; project: Project; task?: Task; id: string };
}

export const ApplyingTemplateForm = component$<Props>(({ formGroup }) => {
	const { customer, project, task, id } = formGroup;
	const key = `${task}-${customer}-${id}`;
	const taskSelectedString = useSignal<string>(task?.name || '');
	const taskOptions = useSignal<string[]>([]);
	const tasks = useSignal<Task[]>([]);

	useTask$(async ({ track }) => {
		track(() => formGroup.customer);
		track(() => formGroup.project);
		track(() => formGroup.task);

		taskSelectedString.value = task?.name || '';
		if (customer) {
			tasks.value = await getTasks(customer, project, true);
			taskOptions.value = tasks.value.map((task) => task.name);
		}
	});

	const _onChangeTask = $(async (value: string) => {
		const taskSelected = tasks.value.find((task) => task.name === value);
		taskSelectedString.value = taskSelected?.name || '';
		formGroup.task = taskSelected;
	});

	return (
		<div key={key} class='flex w-[350px] flex-col gap-2 text-left'>
			<div class='flex flex-col pb-3'>
				<h4 class='text-sm font-normal text-darkgray-500'>
					{t('TEMPLATE_APPLYING_MESSAGE')}
				</h4>
				<h4 class='text-sm font-normal text-darkgray-500'>
					{t('TEMPLATE_APPLYING_SUBMESSAGE')}
				</h4>
			</div>
			<div class='flex flex-col border-b border-gray-200 pb-3'>
				<h4 class='text-sm font-normal text-darkgray-500'>{`${t('CLIENT')}: ${customer?.name}`}</h4>
				<h4 class='text-base font-bold text-dark-grey'>{project?.name}</h4>
			</div>
			<Select
				id={UUID()}
				label={t('TASK_LABEL') + '*'}
				placeholder={t('SELECT_TASK_PLACEHOLDER')}
				value={taskSelectedString}
				options={taskOptions}
				onChange$={_onChangeTask}
				size='auto'
			/>
		</div>
	);
});
