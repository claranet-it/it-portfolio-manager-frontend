import {
	$,
	QRL,
	Signal,
	component$,
	useComputed$,
	useSignal,
	useTask$,
	useVisibleTask$,
} from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { initFlowbite } from 'flowbite';
import { useNewTimeEntry } from '../../hooks/timesheet/useNewTimeEntry';
import { t } from '../../locale/labels';
import { TimeEntry } from '../../models/timeEntry';
import { UUID } from '../../utils/uuid';
import { Button } from '../Button';
import { Autocomplete } from './Autocomplete';
import { Select } from './Select';
import { TemplateForm } from './TemplateForm';

interface NewTaskForm {
	timeEntry: Signal<TimeEntry | undefined>;
	alertMessageState: ModalState;
	onCancel$?: QRL;
}

export const NewTaskForm = component$<NewTaskForm>(
	({ timeEntry, alertMessageState, onCancel$ }) => {
		const {
			dataCustomersSig,
			dataProjectsSig,
			dataTasksSign,
			customerSelected,
			projectSelected,
			taskSelected,
			projectEnableSig,
			taskEnableSig,
			onChangeCustomer,
			onChangeProject,
			clearForm,
			handleSubmit,
			from,
			to,
			isTemplating,
			daysSelected,
			timeHours,
			handleTime,
			handleTemplating,
			resetTemplating,
			handleSubmitTemplating,
		} = useNewTimeEntry(timeEntry, alertMessageState, onCancel$, false);

		useVisibleTask$(() => {
			initFlowbite();
		});

		const _taskSelected = useSignal(taskSelected.value.name);

		const _projectSelected = useSignal(projectSelected.value.name);

		const _dataTasksSign = useComputed$(() => {
			return dataTasksSign.value
				.filter((dataTasks) => dataTasks.completed === false)
				.map((dataTasks) => dataTasks.name);
		});

		const _projectOptions = useComputed$(() => {
			return dataProjectsSig.value
				.filter((dataProject) => dataProject.completed === false)
				.map((project) => project.name);
		});

		const _onCancel = $(() => {
			_projectSelected.value = '';
			clearForm();
			resetTemplating();
			onCancel$ && onCancel$();
		});

		const _onChangeProject = $(async (value: string) => {
			const project = dataProjectsSig.value.find((project) => project.name === value);
			if (project) {
				projectSelected.value = project;
				onChangeProject(project);
			}
		});

		const _handleSubmit = $((event: SubmitEvent, _: HTMLFormElement) => {
			event.preventDefault();
			_projectSelected.value = '';
			console.log('#### isTemplating', isTemplating.value);
			if (isTemplating.value) {
				handleSubmitTemplating(event, _);
			} else {
				handleSubmit(event, _);
			}
		});

		const _onChangeTask = $(async (value: string) => {
			const task = dataTasksSign.value.find((task) => task.name === value);
			if (task) {
				taskSelected.value = task;
			} else {
				taskSelected.value.name = value;
			}
		});

		useTask$(({ track }) => {
			track(() => projectSelected.value);
			_projectSelected.value = projectSelected.value.name;
		});

		useTask$(({ track }) => {
			track(() => taskSelected.value);
			_taskSelected.value = taskSelected.value.name;
		});

		return (
			<>
				<div class='w-96 rounded-md bg-white-100 p-4 shadow'>
					<div class='mb-2 flex items-center justify-between border-b border-gray-200 py-2'>
						<h3 class='text-2xl font-bold text-dark-grey'>
							{t('add_new_project_label')}
						</h3>
					</div>

					<form class='space-y-3' onSubmit$={_handleSubmit}>
						<div class='mt-1 block'>
							<input
								checked={isTemplating.value}
								id={`templating-checkbox`}
								type='checkbox'
								value=''
								onChange$={handleTemplating}
								class='h-4 w-4 rounded border-2 border-clara-red bg-gray-100 text-clara-red focus:ring-2 focus:ring-clara-red'
							/>
							<label
								for={`templating-checkbox`}
								class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
							>
								{t('CREATE_TEMPLATE')}
								<div class='text-xs text-darkgray-500'>
									{t('CREATE_TEMPLATE_MESSAGE')}
								</div>
							</label>
						</div>

						<Autocomplete
							id={UUID()}
							label={t('CUSTOMER_LABEL') + '*'}
							selected={customerSelected}
							data={dataCustomersSig}
							placeholder={t('SEARCH')}
							required
							onChange$={onChangeCustomer}
						/>

						<Select
							id={UUID()}
							label={t('PROJECT_LABEL') + '*'}
							placeholder={
								projectEnableSig.value && _projectOptions.value.length === 0
									? t('NO_ACTIVE_PROJECT_PLACEHOLDER')
									: t('SELECT_PROJECT_PLACEHOLDER')
							}
							value={_projectSelected}
							options={_projectOptions}
							disabled={!projectEnableSig.value}
							onChange$={_onChangeProject}
							size='auto'
						/>

						<Select
							id={UUID()}
							disabled={!taskEnableSig.value}
							label={t('TASK_LABEL') + (isTemplating.value ? '' : '*')}
							placeholder={
								taskEnableSig.value && _dataTasksSign.value.length === 0
									? t('NO_ACTIVE_TASK_PLACEHOLDER')
									: t('SELECT_TASK_PLACEHOLDER')
							}
							value={_taskSelected}
							options={_dataTasksSign}
							onChange$={_onChangeTask}
							size='auto'
						/>

						{isTemplating.value && (
							<TemplateForm
								from={from}
								to={to}
								daysSelected={daysSelected}
								timeHours={timeHours}
								handleTime={handleTime}
								editMode={false}
							/>
						)}

						<div class='flex flex-row justify-end space-x-1'>
							{onCancel$ && (
								<Button variant={'link'} onClick$={_onCancel}>
									{t('ACTION_CANCEL')}
								</Button>
							)}

							<Button type='submit'>{t('ACTION_INSERT')}</Button>
						</div>
						<div class='text-xs text-darkgray-500'>{t('LEGEND_REQUIRED')}</div>
					</form>
				</div>
			</>
		);
	}
);
