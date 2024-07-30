import { $, QRL, Signal, component$, useVisibleTask$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { initFlowbite } from 'flowbite';
import { useNewTimeEntry } from '../../hooks/timesheet/useNewTimeEntry';
import { t, tt } from '../../locale/labels';
import { TimeEntry } from '../../models/timeEntry';
import { UUID } from '../../utils/uuid';
import { Button } from '../Button';
import { Autocomplete } from './Autocomplete';

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
			taskSelected,
			taskEnableSig,
			onChangeCustomer,
			clearForm,
			handleSubmit,
		} = useNewTimeEntry(timeEntry, alertMessageState, onCancel$, allowNewEntry);

		useVisibleTask$(() => {
			initFlowbite();
		});

		const _onCancel = $(() => {
			clearForm();
			onCancel$ && onCancel$();
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
							{/* <Autocomplete
								id={UUID()}
								label={t('PROJECT_LABEL')}
								selected={projectSelected}
								data={dataProjectsSig}
								placeholder='Search...'
								required
								disabled={!projectEnableSig.value}
								onChange$={onChangeProject}
							/> */}

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

						{/* <Select
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
							value={projectTypeSelected}
							options={useSignal(projectTypeList);}
							invalid={projectTypeInvalid.value}
							size='auto'
						/> */}

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
