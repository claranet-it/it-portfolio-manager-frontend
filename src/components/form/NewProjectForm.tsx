import { $, QRL, Signal, component$, useComputed$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { useNewTimeEntry } from '../../hooks/timesheet/useNewTimeEntry';
import { t } from '../../locale/labels';
import { TimeEntry } from '../../models/timeEntry';
import { UUID } from '../../utils/uuid';
import { Button } from '../Button';
import { Autocomplete } from './Autocomplete';
import { Select } from './Select';

interface NewProjectFormProp {
	timeEntry: Signal<TimeEntry | undefined>;
	alertMessageState: ModalState;
	onCancel$?: QRL;
}

export const NewProjectForm = component$<NewProjectFormProp>(
	({ timeEntry, alertMessageState, onCancel$ }) => {
		const {
			dataCustomersSig,
			dataProjectsSig,
			dataTaksSign,
			customerSelected,
			projectSelected,
			taskSelected,
			projectTypeSelected,
			projectEnableSig,
			taskEnableSig,
			onChangeCustomer,
			onChangeProject,
			clearForm,
			handleSubmit,
		} = useNewTimeEntry(timeEntry, alertMessageState, onCancel$);

		const _onCancel = $(() => {
			clearForm();
			onCancel$ && onCancel$();
		});

		const projectTypeList = useComputed$(() => {
			const types = ['', 'billable', 'non-billable', 'slack-time', 'absence'];

			return types;
		});

		return (
			<>
				<div class='p-4 bg-white-100 rounded-md shadow w-96'>
					<form class='space-y-3' onSubmit$={handleSubmit}>
						<Autocomplete
							id={UUID()}
							label={t('CUSTOMER_LABEL')}
							selected={customerSelected}
							data={dataCustomersSig}
							placeholder='Search...'
							required
							onChange$={onChangeCustomer}
						/>

						<Autocomplete
							id={UUID()}
							label={t('PROJECT_LABEL')}
							selected={projectSelected}
							data={dataProjectsSig}
							placeholder='Search...'
							required
							disabled={!projectEnableSig.value}
							onChange$={onChangeProject}
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

						<Select
							id={UUID()}
							disabled={false}
							label='Project Type'
							placeholder='Select Project Type'
							value={projectTypeSelected}
							options={projectTypeList}
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
