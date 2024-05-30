import { component$, $, QRL } from '@builder.io/qwik';
import { Autocomplete } from './Autocomplete';
import { UUID } from '../../utils/uuid';
import { Button } from '../Button';
import { ModalState } from '../../models/modalState';
import { TimeEntry } from '../../models/timeEntry';
import { useNewTimeEntry } from '../../hooks/timesheet/useNewTimeEntry';

interface NewProjectFormProp {
	timeEntries: TimeEntry[];
	alertMessageState: ModalState;
	onCancel$?: QRL;
}

export const NewProjectForm = component$<NewProjectFormProp>(
	({ timeEntries, alertMessageState, onCancel$ }) => {
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
		} = useNewTimeEntry(timeEntries, alertMessageState, onCancel$);

		const _onCancel = $(() => {
			clearForm();
			onCancel$ && onCancel$();
		});

		return (
			<>
				<div class='p-4 bg-white-100 rounded-md shadow w-96'>
					<form class='space-y-3' onSubmit$={handleSubmit}>
						<Autocomplete
							id={UUID()}
							label='Customer'
							selected={customerSelected}
							data={dataCustomersSig}
							placeholder='Search...'
							required
							onChange$={onChangeCustomer}
						/>

						<Autocomplete
							id={UUID()}
							label='Project'
							selected={projectSelected}
							data={dataProjectsSig}
							placeholder='Search...'
							required
							disabled={!projectEnableSig.value}
							onChange$={onChangeProject}
						/>

						<Autocomplete
							id={UUID()}
							label='Task'
							selected={taskSelected}
							data={dataTaksSign}
							placeholder='Search...'
							required
							disabled={!taskEnableSig.value}
						/>

						<div class='flex flex-row space-x-1 justify-end'>
							{onCancel$ && (
								<Button type='button' text='Cancel' onClick$={_onCancel} />
							)}

							<Button type='submit' text='Insert' outline />
						</div>
					</form>
				</div>
			</>
		);
	}
);
