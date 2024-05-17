import { $, sync$, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { Project, Task } from '../utils/types';
import { getCustomers, getProjects, getTasks } from '../utils/api';
import { ModalState } from '../model/ModalState';
import { AppContext } from '../app';
import { t } from '../locale/labels';

export const useNewTimeEntry = (alertMessageState: ModalState) => {
	const appStore = useContext(AppContext);
	//const company = appStore.configuration.company

	const dataCustomersSig = useComputed$(async () => {
		return await getCustomers();
	});

	const dataProjectsSig = useSignal<Project[]>([]);
	const dataTaksSign = useSignal<Task[]>([]);

	const customerSelected = useSignal<string>('');
	const projectSelected = useSignal<string>('');
	const taskSelected = useSignal<string>('');

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

	const onChangeProject = $(async (value: string) => {
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

	const insertNewTimeEntry = $(() => {
		//TODO: POST /dev/api/task/task
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
