import { $, QRL, Signal, component$, useVisibleTask$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { initFlowbite } from 'flowbite';
import { useNewTimeEntry } from '../../hooks/timesheet/useNewTimeEntry';
import { t } from '../../locale/labels';
import { TimeEntry } from '../../models/timeEntry';
import { UUID } from '../../utils/uuid';
import { Button } from '../Button';
import { Autocomplete } from './Autocomplete';
import { Select } from './Select';

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
			dataTaksSign,
			customerSelected,
			projectSelected,
			taskSelected,
			projectEnableSig,
			taskEnableSig,
			onChangeCustomer,
			onChangeProject,
			clearForm,
			handleSubmit,
		} = useNewTimeEntry(timeEntry, alertMessageState, onCancel$, false);

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
								placeholder={t('SEARCH')}
								required
								onChange$={onChangeCustomer}
							/>
						</div>
						<div>
							<Select
								id={UUID()}
								label={t('PROJECT_LABEL')}
								placeholder={t('SELECT_PROJECT_PLACEHOLDER')}
								value={projectSelected}
								options={dataProjectsSig}
								disabled={!projectEnableSig.value}
								onChange$={onChangeProject}
							/>
						</div>

						<Select
							id={UUID()}
							disabled={!taskEnableSig.value}
							label={t('TASK_LABEL')}
							placeholder={t('SELECT_TASK_PLACEHOLDER')}
							value={taskSelected}
							options={dataTaksSign}
							size='auto'
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
