import {
	$,
	QRL,
	Signal,
	component$,
	useComputed$,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { ProjectType } from '@models/project';
import { initFlowbite } from 'flowbite';
import { useNewTimeEntry } from '../../hooks/timesheet/useNewTimeEntry';
import { t, tt } from '../../locale/labels';
import { TimeEntry } from '../../models/timeEntry';
import { UUID } from '../../utils/uuid';
import { Button } from '../Button';
import { Autocomplete } from './Autocomplete';
import { Select } from './Select';

interface NewProjectFormProp {
	timeEntry: Signal<TimeEntry | undefined>;
	alertMessageState: ModalState;
	onCancel$?: QRL;
	allowNewEntry?: boolean;
}

export const NewProjectForm = component$<NewProjectFormProp>(
	({ timeEntry, alertMessageState, onCancel$, allowNewEntry }) => {
		const {
			dataCustomersSig,
			dataProjectsSig,
			dataTaksSign,
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

		const _onCancel = $(() => {
			clearForm();
			onCancel$ && onCancel$();
		});

		const _projectSelected = useSignal(projectSelected.value.name);

		const _projectOptions = useComputed$(() => {
			return dataProjectsSig.value.map((project) => project.name);
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

		const _onChangeTypeProject = $(async (value: string) => {
			projectSelected.value.type = value as ProjectType;
		});

		const _projectTypeSelected = useSignal(projectSelected.value.type);

		useVisibleTask$(({ track }) => {
			track(() => projectSelected.value);
			_projectSelected.value = projectSelected.value.name;
		});

		useVisibleTask$(({ track }) => {
			track(() => projectSelected.value);
			_projectTypeSelected.value = projectSelected.value.type;
		});

		return (
			<>
				<div class='p-4 bg-white-100 rounded-md shadow w-96'>
					<form class='space-y-3' onSubmit$={handleSubmit}>
						<div>
							<Autocomplete
								id={UUID()}
								label={t('CUSTOMER_LABEL')}
								selected={customerSelected}
								data={dataCustomersSig}
								placeholder='Search...'
								required
								onChange$={onChangeCustomer}
							/>
							{!dataCustomersSig.value.includes(customerSelected.value) &&
								customerSelected.value !== '' &&
								allowNewEntry && (
									<p class='text-xs mt-1 text-gray-500 dark:text-gray-400'>
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

							{!dataProjectsSig.value.includes(projectSelected.value) &&
								projectSelected.value.name !== '' &&
								allowNewEntry && (
									<p class='text-xs mt-1 text-gray-500 dark:text-gray-400'>
										{tt('REGISTRY_CREATE_MESSAGE', {
											type: 'project',
										})}
									</p>
								)}
						</div>

						<Select
							hidden={
								!(
									allowNewEntry &&
									(projectTypeEnabled.newCustomer ||
										projectTypeEnabled.newProject)
								)
							}
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

						<Autocomplete
							id={UUID()}
							label={t('TASK_LABEL')}
							selected={taskSelected}
							data={dataTaksSign}
							placeholder='Search...'
							required
							disabled={!taskEnableSig.value}
						/>

						<div class='flex flex-row space-x-1 justify-end'>
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
