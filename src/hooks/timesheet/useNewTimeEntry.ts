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
import { format } from 'date-fns';
import { t, tt } from '../../locale/labels';
import { Customer } from '../../models/customer';
import { Project, ProjectType } from '../../models/project';
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
	const dataTaksSign = useSignal<Task[]>([]);

	const customerSelected = useSignal<Customer>('');
	const projectSelected = useSignal<Project>('');
	const taskSelected = useSignal<Task>('');
	const projectTypeSelected = useSignal<ProjectType>('');
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
				projectTypeSelected.value = '';
			} else {
				projectTypeEnabled.newCustomer = true;
			}
		} else if (project !== undefined) {
			if (project === '' || dataProjectsSig.value.includes(project)) {
				projectTypeEnabled.newProject = false;
				projectTypeSelected.value = '';
			} else {
				projectTypeEnabled.newProject = true;
			}
		}
	});

	const onChangeCustomer = $(async (value: string) => {
		projectSelected.value = '';
		if (value != '') {
			dataProjectsSig.value = await getProjects('it', value);
			projectEnableSig.value = true;
		} else {
			projectEnableSig.value = false;
		}
		handleProjectTypeEnabled(value);
	});

	const onChangeProject = $(async (value: Project) => {
		taskSelected.value = '';
		if (value != '') {
			dataTaksSign.value = await getTasks('it', customerSelected.value, value);
			taskEnableSig.value = true;
		} else {
			taskEnableSig.value = false;
		}
		handleProjectTypeEnabled(undefined, value);
	});

	const clearForm = $(() => {
		customerSelected.value = '';
		projectSelected.value = '';
		taskSelected.value = '';
		projectTypeSelected.value = '';
		projectTypeEnabled.newCustomer = false;
		projectTypeEnabled.newProject = false;
	});

	const insertNewTimeEntry = $(async () => {
		const savingResult = await saveTask(
			'it',
			customerSelected.value,
			projectSelected.value,
			taskSelected.value,
			projectTypeSelected.value === '' ? undefined : projectTypeSelected.value
		);

		if (!savingResult) {
			// Show error
			addEvent({
				type: 'danger',
				message: `Something went wrong`,
			});
		} else {
			// add new timeEntry to store
			newTimeEntry.value = {
				date: format(new Date(), 'yyyy-MM-dd'),
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
					project: projectSelected.value,
					task: taskSelected.value,
				}),
				autoclose: true,
			});

			clearForm();
			closeForm && closeForm();
		}
	});

	const newEntityExist = (): boolean => {
		return Boolean(
			dataCustomersSig.value.find((customer) => customer === customerSelected.value) &&
				dataProjectsSig.value.find((project) => project === projectSelected.value) &&
				dataTaksSign.value.find((task) => task === taskSelected.value)
		);
	};

	const showAlert = (props: ModalState) => {
		(alertMessageState.isVisible = true), (alertMessageState.title = props.title);
		alertMessageState.message = props.message;
		(alertMessageState.confirmLabel = props.confirmLabel),
			(alertMessageState.cancelLabel = props.cancelLabel);
		alertMessageState.onConfirm$ = props.onConfirm$;
	};

	useTask$(({ track }) => {
		const projectTypeValue = track(() => projectTypeSelected.value);
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

			if (projectTypeSelected.value === '' && isProjectTypeEnabled) {
				projectTypeInvalid.value = true;
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
		dataTaksSign,
		customerSelected,
		projectSelected,
		taskSelected,
		projectTypeSelected,
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
