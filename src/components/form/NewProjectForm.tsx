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
import { ProjectType } from '@models/project';
import { initFlowbite } from 'flowbite';
import { INIT_TASK_VALUE } from 'src/utils/constants';
import { useNewTimeEntry } from '../../hooks/timesheet/useNewTimeEntry';
import { t, tt } from '../../locale/labels';
import { TimeEntry } from '../../models/timeEntry';
import { UUID } from '../../utils/uuid';
import { Button } from '../Button';
import { Autocomplete } from './Autocomplete';
import { Input } from './Input';
import { Select } from './Select';

interface NewProjectFormProp {
	timeEntry: Signal<TimeEntry | undefined>;
	alertMessageState: ModalState;
	onCancel$?: QRL;
	allowNewEntry?: boolean;
	preSelectedData: Signal<{
		customer?: string;
		project?: string;
	}>;
}

export const NewProjectForm = component$<NewProjectFormProp>(
	({ timeEntry, alertMessageState, onCancel$, allowNewEntry, preSelectedData }) => {
		const {
			dataCustomersSig,
			dataProjectsSig,
			dataTasksSign,
			customerSelected,
			projectSelected,
			projectEnableSig,
			projectTypeEnabled,
			projectTypeInvalid,
			taskSelected,
			taskEnableSig,
			onChangeCustomer,
			onChangeProject,
			clearForm,
			handleSubmit,
		} = useNewTimeEntry(timeEntry, alertMessageState, onCancel$, allowNewEntry);

		useVisibleTask$(() => {
			initFlowbite();
		});

		const _projectTypeOptions = useSignal([
			'billable',
			'non-billable',
			'slack-time',
			'absence',
		]);

		const _projectSelected = useSignal(
			preSelectedData.value.project ?? projectSelected.value.name
		);
		const _taskSelected = useSignal(taskSelected.value.name);

		const _projectTypeSelected = useSignal(projectSelected.value.type);

		const _customerOptions = useComputed$(() => {
			return dataCustomersSig.value.map((customer) => customer.name);
		});

		const _projectOptions = useComputed$(() => {
			return dataProjectsSig.value.map((project) => project.name);
		});

		const _dataTasksSign = useComputed$(() => {
			return dataTasksSign.value.map((dataTasks) => dataTasks.name);
		});

		const _onCancel = $(() => {
			clearForm();
			_projectSelected.value = '';
			_projectTypeSelected.value = '';
			_taskSelected.value = '';

			onCancel$ && onCancel$();
		});

		const _onChangeProject = $(async (value: string) => {
			const project = dataProjectsSig.value.find((project) => project.name === value);
			if (project) {
				projectSelected.value = project;
				onChangeProject(project);
			} else {
				// new project
				projectSelected.value.name = value;
				onChangeProject(projectSelected.value);
			}
		});

		const _onChangeTask = $(async (value: string) => {
			const task = dataTasksSign.value.find((task) => task.name === value);
			if (task) {
				taskSelected.value = task;
			} else {
				taskSelected.value = {
					...INIT_TASK_VALUE,
					name: value,
				};
			}
		});

		const onChangePlannedHours = $((value: string, type: 'task' | 'project') => {
			if (type === 'task') {
				if (value === '') {
					taskSelected.value.plannedHours = 0;
				} else {
					taskSelected.value.plannedHours = Number(value);
				}
			} else if (type === 'project') {
				if (value === '') {
					projectSelected.value.plannedHours = 0;
				} else {
					projectSelected.value.plannedHours = Number(value);
				}
			}
		});

		const _onChangeTypeProject = $(async (value: string) => {
			projectSelected.value.type = value as ProjectType;
		});

		useTask$(({ track }) => {
			track(() => projectSelected.value.name);
			_projectSelected.value = projectSelected.value.name;
			_projectTypeSelected.value = projectSelected.value.type;
		});

		useTask$(({ track }) => {
			track(() => taskSelected.value.name);
			_taskSelected.value = taskSelected.value.name;
		});

		useVisibleTask$(async ({ track }) => {
			track(() => preSelectedData.value);

			if (
				preSelectedData.value.customer === undefined &&
				preSelectedData.value.project === undefined
			) {
				return;
			}

			if (preSelectedData.value.customer) {
				customerSelected.value = preSelectedData.value.customer;
				await onChangeCustomer(preSelectedData.value.customer);
			}

			if (preSelectedData.value.project) {
				await _onChangeProject(preSelectedData.value.project);
			}
		});

		return (
			<>
				<div class='w-96 rounded-md bg-white-100 p-4 shadow'>
					<form class='space-y-3' onSubmit$={handleSubmit}>
						<div>
							<Autocomplete
								id={UUID()}
								label={t('CUSTOMER_LABEL')}
								selected={customerSelected}
								data={_customerOptions}
								placeholder='Search...'
								required
								onChange$={onChangeCustomer}
							/>
							{!dataCustomersSig.value
								.map((customer) => customer.name)
								.includes(customerSelected.value) &&
								customerSelected.value !== '' &&
								allowNewEntry && (
									<p class='mt-1 text-xs text-gray-500 dark:text-gray-400'>
										{tt('REGISTRY_CREATE_MESSAGE', {
											type: 'customer',
										})}
									</p>
								)}
						</div>
						<div>
							<Autocomplete
								id={UUID()}
								label={t('PROJECT_LABEL')}
								selected={_projectSelected}
								data={_projectOptions}
								placeholder='Search...'
								required
								disabled={!projectEnableSig.value}
								onChange$={_onChangeProject}
							/>
							{!dataProjectsSig.value
								.map((project) => project.name)
								.includes(_projectSelected.value) &&
								_projectSelected.value !== '' &&
								allowNewEntry && (
									<p class='mt-1 text-xs text-gray-500 dark:text-gray-400'>
										{tt('REGISTRY_CREATE_MESSAGE', {
											type: 'project',
										})}
									</p>
								)}
						</div>

						{allowNewEntry &&
							(projectTypeEnabled.newCustomer || projectTypeEnabled.newProject) && (
								<div class='flex w-full flex-row gap-2'>
									<Select
										id={UUID()}
										disabled={!taskEnableSig.value}
										label='Project Type'
										placeholder='Select Project Type'
										value={_projectTypeSelected}
										options={_projectTypeOptions}
										invalid={projectTypeInvalid.value}
										size='auto'
										onChange$={_onChangeTypeProject}
									/>

									<Input
										id={UUID()}
										type='number'
										label={'Project planned hours:'}
										placeholder='0'
										value={projectSelected.value.plannedHours}
										styleClass='w-full'
										onChange$={(event) =>
											onChangePlannedHours(
												(event.target as HTMLInputElement).value,
												'project'
											)
										}
									/>
								</div>
							)}

						<Autocomplete
							id={UUID()}
							label={t('TASK_LABEL')}
							selected={_taskSelected}
							data={_dataTasksSign}
							placeholder='Search...'
							required
							disabled={!taskEnableSig.value}
							onChange$={_onChangeTask}
						/>

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
