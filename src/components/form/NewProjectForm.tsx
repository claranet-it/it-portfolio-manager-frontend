import {
	component$,
	useSignal,
	$,
	sync$,
	QRL,
	useResource$,
	Signal,
	useComputed$,
	useContext,
} from '@builder.io/qwik';
import { Autocomplete } from './Autocomplete';
import { UUID } from '../../utils/uuid';
import { Button } from '../Button';
import { getCustomers, getProjects, getTasks } from '../../utils/api';
import { Project, Task } from '../../utils/types';
import { AppContext } from '../../app';
import { ModalState } from '../../model/ModalState';
import { useNewTimeEntry } from '../../hooks/useNewTimeEntry';

type NewProjectFormProp = {
	alertMessageState: ModalState;
	onCancel$?: QRL;
};

export const NewProjectForm = component$<NewProjectFormProp>(({ alertMessageState, onCancel$ }) => {
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
	} = useNewTimeEntry(alertMessageState);

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
						{onCancel$ && <Button type='button' text='Cancel' onClick$={_onCancel} />}

						<Button type='submit' text='Insert' outline />
					</div>
				</form>
			</div>
		</>
	);
});
