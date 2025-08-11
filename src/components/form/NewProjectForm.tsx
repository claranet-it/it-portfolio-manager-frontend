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
import { Customer } from '../../models/customer';
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

		const _customerNames = useComputed$(() => {
			return dataCustomersSig.value.map((customer) => customer.name);
		});

		const _customerSelected = useSignal(customerSelected.value.name);

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
			_customerSelected.value = '';

			onCancel$ && onCancel$();
		});

		const _onChangeCustomer = $(async (customerName: string) => {
			const foundCustomer = dataCustomersSig.value.find((c) => c.name === customerName);
			const customer: Customer = foundCustomer || { id: '', name: customerName };

			await onChangeCustomer(customer);
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
			track(() => customerSelected.value.name);
			_customerSelected.value = customerSelected.value.name;
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
				await _onChangeCustomer(preSelectedData.value.customer);
			}

			if (preSelectedData.value.project) {
				await _onChangeProject(preSelectedData.value.project);
			}
		});

		return (
			<>
				<div class='w-96 rounded-md bg-white-100 p-4 shadow'>
					<div class='mb-2 flex items-center justify-between border-b border-gray-200 py-2'>
						<h3 class='text-2xl font-bold text-dark-grey'>{'Add new entry'}</h3>
					</div>

					<form class='space-y-3' onSubmit$={handleSubmit}>
						<div>
							<Autocomplete
								id={UUID()}
								label={t('CUSTOMER_LABEL')}
								selected={_customerSelected}
								data={_customerNames}
								placeholder='Insert customer...'
								required
								onChange$={_onChangeCustomer}
							/>
							{!dataCustomersSig.value.some(
								(c) => c.name === customerSelected.value.name
							) &&
								customerSelected.value.name !== '' &&
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
								placeholder='Insert project...'
								required
								disabled={!projectEnableSig.value}
								onChange$={_onChangeProject}
							/>

							{!dataProjectsSig.value.some(
								(p) => p.name === projectSelected.value.name
							) &&
								projectSelected.value.name !== '' &&
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
							placeholder='Insert task...'
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
