import {
	$,
	QRL,
	Signal,
	sync$,
	useComputed$,
	useSignal,
	useStore,
	useTask$,
} from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { getCurrentRoute, navigateTo } from 'src/router';
import { INIT_PROJECT_VALUE, INIT_TASK_VALUE } from 'src/utils/constants';
import { t, tt } from '../../locale/labels';
import { Customer } from '../../models/customer';
import { Project } from '../../models/project';
import { Task } from '../../models/task';
import { TimeEntry } from '../../models/timeEntry';
import { getCustomers } from '../../services/customer';
import { getProjects } from '../../services/projects';
import { getTasks, saveTask } from '../../services/tasks';
import { useNotification } from '../useNotification';

export const useNewTimeEntry = (
	newTimeEntry: Signal<TimeEntry | undefined>,
	alertMessageState: ModalState,
	closeForm?: QRL,
	allowNewEntry?: boolean
) => {
	const { addEvent } = useNotification();

	const dataCustomersSig = useComputed$(async () => {
		return await getCustomers();
	});

	const dataProjectsSig = useSignal<Project[]>([]);
	const dataTasksSign = useSignal<Task[]>([]);

	const initCustomer: Customer = '';

	const customerSelected = useSignal<Customer>('');
	const projectSelected = useSignal<Project>(INIT_PROJECT_VALUE);
	const taskSelected = useSignal<Task>(INIT_TASK_VALUE);
	const projectTypeInvalid = useSignal<boolean>(false);
	const projectTypeEnabled = useStore<{
		newCustomer: boolean;
		newProject: boolean;
	}>({ newCustomer: false, newProject: false });

	const projectEnableSig = useSignal(false);
	const taskEnableSig = useSignal(false);

	const handleProjectTypeEnabled = $((customer?: Customer, project?: Project) => {
		if (customer !== undefined) {
			if (customer === '' || dataCustomersSig.value.includes(customer)) {
				projectTypeEnabled.newCustomer = false;
				if (project === undefined || project.type === '') {
					projectSelected.value = INIT_PROJECT_VALUE;
				}
			} else {
				projectTypeEnabled.newCustomer = true;
			}
		} else if (project !== undefined) {
			if (project.name === '' || dataProjectsSig.value.includes(project)) {
				projectTypeEnabled.newProject = false;
				projectTypeEnabled.newCustomer = true;
			} else {
				projectTypeEnabled.newProject = true;
			}
		}
	});

	const onChangeCustomer = $(async (value: string) => {
		if (value !== '' && value === customerSelected.value && projectSelected.value.name !== '') {
			return;
		}
		projectSelected.value = INIT_PROJECT_VALUE;
		taskSelected.value = INIT_TASK_VALUE;
		if (value != '') {
			dataProjectsSig.value = await getProjects(value);
			projectEnableSig.value = true;
		} else {
			projectTypeEnabled.newProject = false;
			projectTypeEnabled.newCustomer = false;
			projectEnableSig.value = false;
			taskEnableSig.value = false;
		}

		handleProjectTypeEnabled(value);
	});

	const onChangeProject = $(async (value: Project) => {
		if (customerSelected.value !== '') {
			taskSelected.value = INIT_TASK_VALUE;
			if (value.name !== '') {
				dataTasksSign.value = await getTasks(customerSelected.value, value);
				taskEnableSig.value = true;
			} else {
				taskEnableSig.value = false;
			}
			handleProjectTypeEnabled(undefined, value);
		}
	});

	const clearForm = sync$(() => {
		customerSelected.value = initCustomer;
		projectSelected.value = INIT_PROJECT_VALUE;
		taskSelected.value = INIT_TASK_VALUE;
		projectTypeEnabled.newCustomer = false;
		projectTypeEnabled.newProject = false;
	});

	const insertNewTimeEntry = $(async () => {
		const savingResult = await saveTask(
			customerSelected.value,
			projectSelected.value,
			taskSelected.value.name
		);

		if (!savingResult) {
			// Show error
			addEvent({
				type: 'danger',
				message: t('GENERIC_BE_ERROR'),
			});
		} else {
			// add new timeEntry to store
			newTimeEntry.value = {
				date: '',
				company: 'it', //TODO: Replace with the company value
				customer: customerSelected.value,
				project: projectSelected.value,
				task: taskSelected.value,
				hours: 0,
				isUnsaved: true,
			};

			addEvent({
				type: 'success',
				message: tt('INSERT_NEW_PROJECT_SUCCESS_MESSAGE', {
					customer: customerSelected.value,
					project: projectSelected.value.name ?? '',
					task: taskSelected.value.name,
				}),
				autoclose: true,
			});

			if (allowNewEntry) {
				if (getCurrentRoute() === 'registry') {
					navigateTo('registry', {
						customer: customerSelected.value,
						project: projectSelected.value.name,
					});
				}
			}

			clearForm();
			closeForm && closeForm();
		}
	});

	const newEntityExist = (): boolean => {
		const dataCustomerExist = dataCustomersSig.value.find(
			(customer) => customer === customerSelected.value
		);
		const dataProjectExist = dataProjectsSig.value.find(
			(project) => project.name === projectSelected.value.name
		);
		const dataTaskExist = dataTasksSign.value.find(
			(task) => task.name === taskSelected.value.name
		);

		return Boolean(dataCustomerExist && dataProjectExist && dataTaskExist);
	};

	const showAlert = (props: ModalState) => {
		(alertMessageState.isVisible = true), (alertMessageState.title = props.title);
		alertMessageState.message = props.message;
		(alertMessageState.confirmLabel = props.confirmLabel),
			(alertMessageState.cancelLabel = props.cancelLabel);
		alertMessageState.onConfirm$ = props.onConfirm$;
	};

	useTask$(({ track }) => {
		const projectTypeValue = track(() => projectSelected.value.type);
		if (projectTypeInvalid.value && projectTypeValue !== '') {
			projectTypeInvalid.value = false;
		}
	});

	const handleSubmit = sync$((event: SubmitEvent, _: HTMLFormElement) => {
		event.preventDefault();

		const isNewEntryAlreadyInserted = newEntityExist();

		if (allowNewEntry) {
			const isProjectTypeEnabled =
				projectTypeEnabled.newCustomer || projectTypeEnabled.newProject;

			if (projectSelected.value.name === '' && isProjectTypeEnabled) {
				projectTypeInvalid.value = true;
				return;
			}

			if (projectSelected.value.type === '' && isProjectTypeEnabled) {
				showAlert({
					title: t('INSERT_NEW_PROJECT_TITLE_MODAL'),
					message: t('EMPTY_PROJECT_TYPE_MESSAGE'),
					cancelLabel: t('ACTION_CANCEL'),
				});
				return;
			}

			if (isNewEntryAlreadyInserted) {
				showAlert({
					title: t('EXISTING_ENTITY_TITLE'),
					message: t('EXISTING_ENTITY_MESSAGE'),
					cancelLabel: t('ACTION_CANCEL'),
				});
			} else {
				showAlert({
					title: t('INSERT_NEW_PROJECT_TITLE_MODAL'),
					message: t('INSERT_NEW_PROJECT_MESSAGE_MODAL'),
					confirmLabel: t('ACTION_CONFIRM'),
					cancelLabel: t('ACTION_CANCEL'),
					onConfirm$: insertNewTimeEntry,
				});
			}
		} else {
			if (isNewEntryAlreadyInserted) {
				insertNewTimeEntry();
			} else {
				showAlert({
					title: t('CANNOT_CREATE_ENTITY_TITLE'),
					message: t('CANNOT_CREATE_ENTITY_MESSAGE'),
					cancelLabel: t('ACTION_CANCEL'),
				});
			}
		}
	});

	return {
		dataCustomersSig,
		dataProjectsSig,
		dataTasksSign,
		customerSelected,
		projectSelected,
		taskSelected,
		projectTypeInvalid,
		projectTypeEnabled,
		projectEnableSig,
		taskEnableSig,
		onChangeCustomer,
		onChangeProject,
		clearForm,
		handleSubmit,
	};
};
