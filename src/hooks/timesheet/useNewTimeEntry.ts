import {
	$,
	QRL,
	Signal,
	sync$,
	useComputed$,
	useContext,
	useSignal,
	useStore,
	useTask$,
} from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { AppContext } from 'src/app';
import { getCurrentRoute, navigateTo } from 'src/router';
import { saveTemplate } from 'src/services/template';
import { INIT_PROJECT_VALUE, INIT_TASK_VALUE } from 'src/utils/constants';
import { dayOfWeekToNumber, formatDateString } from 'src/utils/dates';
import { convertTimeToDecimal } from 'src/utils/timesheet';
import { t, tt } from '../../locale/labels';
import { Customer } from '../../models/customer';
import { Project } from '../../models/project';
import { Task } from '../../models/task';
import { TimeEntry } from '../../models/timeEntry';
import { getCustomers } from '../../services/customer';
import { getProjects } from '../../services/projects';
import { getTasks, saveTask } from '../../services/tasks';
import { useNotification } from '../useNotification';
import { useGetTimeSheetDays } from './useGetTimeSheetDays';

export const useNewTimeEntry = (
	newTimeEntry: Signal<TimeEntry | undefined>,
	alertMessageState: ModalState,
	closeForm?: QRL,
	allowNewEntry?: boolean
) => {
	const { addEvent } = useNotification();
	const appStore = useContext(AppContext);

	const dataCustomersSig = useComputed$(async () => {
		return await getCustomers();
	});

	const dataProjectsSig = useSignal<Project[]>([]);
	const dataTasksSign = useSignal<Task[]>([]);

	const customerSelected = useSignal<Customer>({ id: '', name: '' });
	const projectSelected = useSignal<Project>({
		id: '',
		name: '',
		type: '',
		plannedHours: 0,
	} as Project);
	const taskSelected = useSignal<Task>(INIT_TASK_VALUE);
	const projectTypeInvalid = useSignal<boolean>(false);
	const projectTypeEnabled = useStore<{
		newCustomer: boolean;
		newProject: boolean;
	}>({ newCustomer: false, newProject: false });

	const projectEnableSig = useSignal(false);
	const taskEnableSig = useSignal(false);

	const { from, to, currentWeek } = useGetTimeSheetDays();
	const isTemplating = useSignal(false);

	const daysSelected = useSignal<string[]>([]);
	const timeHours = useSignal<number>(0);

	const handleProjectTypeEnabled = $((customer?: Customer, project?: Project) => {
		if (customer !== undefined) {
			if (
				customer.name === '' ||
				dataCustomersSig.value.some((c) => c.name === customer.name)
			) {
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

	const onChangeCustomer = $(async (customer: Customer) => {
		if (
			customer.name !== '' &&
			customer.name === customerSelected.value.name &&
			projectSelected.value.name !== ''
		) {
			return;
		}
		projectSelected.value = INIT_PROJECT_VALUE;
		taskSelected.value = INIT_TASK_VALUE;

		customerSelected.value = customer;

		if (customer.name !== '') {
			dataProjectsSig.value = await getProjects(customer);
			projectEnableSig.value = true;
		} else {
			projectTypeEnabled.newProject = false;
			projectTypeEnabled.newCustomer = false;
			projectEnableSig.value = false;
			taskEnableSig.value = false;
		}

		handleProjectTypeEnabled(customer);
	});

	const onChangeProject = $(async (value: Project) => {
		if (customerSelected.value.name !== '') {
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
		customerSelected.value = { id: '', name: '' };
		projectSelected.value = { id: '', name: '', type: '', plannedHours: 0 } as Project;
		taskSelected.value = INIT_TASK_VALUE;
		projectTypeEnabled.newCustomer = false;
		projectTypeEnabled.newProject = false;
		isTemplating.value = false;
	});

	const insertNewTimeEntry = $(async () => {
		if (allowNewEntry) {
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
				addEvent({
					type: 'success',
					message: tt('INSERT_NEW_PROJECT_SUCCESS_MESSAGE', {
						customer: customerSelected.value.name,
						project: projectSelected.value.name ?? '',
						task: taskSelected.value.name,
					}),
					autoclose: true,
				});

				if (getCurrentRoute() === 'registry') {
					navigateTo('registry', {
						customer: customerSelected.value.name,
						project: projectSelected.value.name,
					});
				}
			}
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
		}

		clearForm();
		closeForm && closeForm();
	});

	const newEntityExist = (): boolean => {
		const dataCustomerExist = dataCustomersSig.value.find(
			(customer) => customer.name === customerSelected.value.name
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

	const handleSubmitTemplating = sync$(async (event: SubmitEvent, _: HTMLFormElement) => {
		event.preventDefault();
		const isProjectTypeEnabled =
			projectTypeEnabled.newCustomer || projectTypeEnabled.newProject;
		if (projectSelected.value.type === '' && isProjectTypeEnabled) {
			showAlert({
				title: t('INSERT_NEW_PROJECT_TITLE_MODAL'),
				message: t('EMPTY_PROJECT_TYPE_MESSAGE'),
				cancelLabel: t('ACTION_CANCEL'),
			});
			return;
		}

		if (timeHours.value === 0) {
			showAlert({
				title: t('ADD_NEW_TIME_ENTRY'),
				message: t('EMPTY_PROJECT_TYPE_MESSAGE'),
				cancelLabel: t('ACTION_CANCEL'),
			});
			return;
		}

		if (!daysSelected.value.length) {
			showAlert({
				title: t('INSERT_NEW_PROJECT_TITLE_MODAL'),
				message: t('EMPTY_DAYTIME_TYPE_MESSAGE'),
				cancelLabel: t('ACTION_CANCEL'),
			});
			return;
		}
		appStore.isLoading = true;
		try {
			const payload = {
				date_start: formatDateString(from.value),
				date_end: formatDateString(to.value),
				daytime: daysSelected.value.map(dayOfWeekToNumber),
				timehours: timeHours.value,
				customer: customerSelected.value.id,
				project: projectSelected.value.name,
				task: taskSelected.value.name,
			};
			await saveTemplate(payload);
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}
		appStore.isLoading = false;

		clearForm();
		resetTemplating();
		closeForm && closeForm();
	});

	const resetTemplating = $(() => {
		daysSelected.value = [];
		timeHours.value = 0;
		currentWeek();
	});

	const handleTime = $((el: FocusEvent) => {
		const value = (el.target as HTMLInputElement).value;
		timeHours.value = convertTimeToDecimal(value);
	});

	const handleTemplating = $(() => {
		isTemplating.value = !isTemplating.value;
		resetTemplating();
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
		from,
		to,
		isTemplating,
		daysSelected,
		timeHours,
		handleTime,
		handleTemplating,
		resetTemplating,
		handleSubmitTemplating,
	};
};
