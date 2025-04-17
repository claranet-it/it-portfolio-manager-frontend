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
import { DataRange } from './DataRange';
import { Multiselect } from './Multiselect';
import { Select } from './Select';
import { TimePicker } from './TimePicker';

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
			daytimeOptions,
			daysSelected,
			description,
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
						<Autocomplete
							id={UUID()}
							label={t('CUSTOMER_LABEL')}
							selected={customerSelected}
							data={dataCustomersSig}
							placeholder={t('SEARCH')}
							required
							onChange$={onChangeCustomer}
						/>

						<Select
							id={UUID()}
							label={t('PROJECT_LABEL')}
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
							label={t('TASK_LABEL')}
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
								Repeat time entry
								<div class='text-xs text-darkgray-500'>
									This action will generate a template.
								</div>
							</label>
						</div>

						{isTemplating.value && (
							<>
								<div class='flex justify-between'>
									<div>
										<label class='block text-sm font-normal text-dark-grey'>
											{t('TIME_LABEL')}
										</label>
										<TimePicker
											hideOptions={true}
											bindValue={timeHours.value}
											onChange$={handleTime}
											required
										/>
									</div>
									<DataRange
										title={t('TIME_PERIOD_LABEL')}
										from={from}
										to={to}
										modalId={UUID()}
									/>
								</div>
								<Multiselect
									id={UUID() + '-daytime'}
									label={t('DAYTIME_LABEL')}
									placeholder={t('select_empty_label')}
									value={daysSelected}
									options={daytimeOptions}
									allowSelectAll
									size='auto'
								/>

								<div>
									<label
										for='templating-description'
										class='block text-sm font-normal text-dark-grey'
									>
										{t('DESCRIPTION_LABEL')}
									</label>
									<textarea
										id='templating-description'
										rows={4}
										class='mt-0 block w-full rounded-md border border-gray-500 bg-white-100 p-2.5 text-sm text-gray-900'
										placeholder={t('DESCRIPTION_INSER_LABEL')}
										bind:value={description}
									></textarea>
								</div>
							</>
						)}

						<div class='flex flex-row justify-end space-x-1'>
							{onCancel$ && (
								<Button variant={'link'} onClick$={_onCancel}>
									{t('ACTION_CANCEL')}
								</Button>
							)}

							<Button type='submit'>{t('ACTION_INSERT')}</Button>
						</div>
					</form>
				</div>
			</>
		);
	}
);
