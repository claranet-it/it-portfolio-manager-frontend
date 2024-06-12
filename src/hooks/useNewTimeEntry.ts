import { $, sync$, useComputed$, useSignal } from '@builder.io/qwik';
import { ModalState } from '../models/modalState';
import { t, tt } from '../locale/labels';
import { getCustomers } from '../services/customer';
import { getProjects } from '../services/projects';
import { getTasks, saveTask } from '../services/tasks';
import { Project } from '../models/project';
import { Customer } from '../models/customer';
import { useNotification } from './useNotification';
import { Task } from '../models/task';

export const useNewTimeEntry = (alertMessageState: ModalState) => {
	const { addEvent } = useNotification();

	const dataCustomersSig = useComputed$(async () => {
		return await getCustomers();
	});

	const dataProjectsSig = useSignal<Project[]>([]);
	const dataTaksSign = useSignal<Task[]>([]);

	const customerSelected = useSignal<Customer>('');
	const projectSelected = useSignal<Project>('');
	const taskSelected = useSignal<Task>('');

	const projectEnableSig = useSignal(false);
	const taskEnableSig = useSignal(false);

	const onChangeCustomer = $(async (value: string) => {
		projectSelected.value = '';
		if (value != '') {
			dataProjectsSig.value = await getProjects('it', value);
			projectEnableSig.value = true;
		} else {
			projectEnableSig.value = false;
		}
	});

	const onChangeProject = $(async (value: Task) => {
		taskSelected.value = '';
		if (value != '') {
			dataTaksSign.value = await getTasks('it', customerSelected.value, value);
			taskEnableSig.value = true;
		} else {
			taskEnableSig.value = false;
		}
	});

	const clearForm = $(() => {
		customerSelected.value = '';
		projectSelected.value = '';
		taskSelected.value = '';
	});

	const insertNewTimeEntry = $(async () => {
		const savingResult = await saveTask(
			'it',
			customerSelected.value,
			projectSelected.value,
			taskSelected.value
		);

		if (!savingResult) {
			// Show error
			addEvent({
				type: 'danger',
				message: `Something went wrong`,
			});
		} else {
			addEvent({
				type: 'success',
				message: tt('INSERT_NEW_PROJECT_SUCCESS_MESSAGE', {
					customer: customerSelected.value,
					project: projectSelected.value,
					task: taskSelected.value,
				}),
				autoclose: true,
			});
			clearForm();
		}

		//TODO: local saving time entry
	});

	const newEntityExist = (): boolean => {
		return dataCustomersSig.value.find((customer) => customer === customerSelected.value) &&
			dataProjectsSig.value.find((project) => project === projectSelected.value) &&
			dataTaksSign.value.find((task) => task === taskSelected.value)
			? false
			: true;
	};

	const showNewEntityAlert = () => {
		(alertMessageState.isVisible = true),
			(alertMessageState.title = t('INSERT_NEW_PROJECT_TITLE_MODAL'));
		alertMessageState.message = t('INSERT_NEW_PROJECT_MESSAGE_MODAL');
		(alertMessageState.confirmLabel = t('ACTION_CONFIRM')),
			(alertMessageState.cancelLabel = t('ACTION_CANCEL'));
		alertMessageState.onConfirm$ = insertNewTimeEntry;
	};

	const handleSubmit = sync$((event: SubmitEvent, _: HTMLFormElement) => {
		event.preventDefault();

		if (newEntityExist()) showNewEntityAlert();
		else insertNewTimeEntry();
	});

	return {
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
	};
};
