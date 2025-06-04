import { $, QRL, Signal, useContext, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { Template } from '@models/template';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
import { deleteTemplate, updateTemplate } from 'src/services/template';
import { dayOfWeekToNumber, formatDateString, NumberToDayOfWeek } from 'src/utils/dates';
import { convertTimeToDecimal } from 'src/utils/timesheet';
import { useNotification } from '../useNotification';

export const useTemplateList = (templates: Signal<Template[]>, fetchTemplates: QRL) => {
	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const daysSelected = useSignal<string[]>([]);
	const timeHours = useSignal<number>(0);
	const from = useSignal<Date>(new Date());
	const to = useSignal<Date>(new Date());
	const customer = useSignal<Customer>();
	const project = useSignal<Project>();
	const task = useSignal<Task>();

	const totalPlannedHours = $((template: Template) => {
		const fromDate = new Date(template.date_start);
		const toDate = new Date(template.date_end);
		const startDate = new Date(fromDate);

		let totalHours = 0;
		while (startDate <= toDate) {
			if (template.daytime.includes(startDate.getDay())) {
				totalHours += template.timehours;
			}
			startDate.setDate(startDate.getDate() + 1);
		}

		return totalHours;
	});

	const deleteModalState = useStore<ModalState & { idToDelete?: string }>({
		title: t('TEMPLATE_DELETE'),
		message: t('TEMPLATE_DELETE_MESSAGE'),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
		idToDelete: undefined,
	});

	const editModalState = useStore<ModalState & { idToEdit?: string }>({
		title: t('TEMPLATE_EDIT'),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
		idToEdit: undefined,
		requiredLabel: true,
	});

	const openDeleteDialog = $((id: string) => {
		deleteModalState.idToDelete = id;
		deleteModalState.isVisible = true;
	});

	const openEditDialog = $((id: string) => {
		editModalState.idToEdit = id;
		const template = templates.value?.find((item) => item.id === id);
		if (template) {
			from.value = new Date(template.date_start);
			to.value = new Date(template.date_end);
			timeHours.value = template.timehours;
			daysSelected.value = template.daytime.map(NumberToDayOfWeek);
			customer.value = template.customer;
			task.value = template.task;
			project.value = template.project;
		}
		editModalState.isVisible = true;
	});

	useTask$(() => {
		deleteModalState.onCancel$ = $(() => {
			deleteModalState.idToDelete = undefined;
		});

		deleteModalState.onConfirm$ = $(async () => {
			if (deleteModalState.idToDelete) {
				appStore.isLoading = true;
				try {
					await deleteTemplate(deleteModalState.idToDelete);
					await fetchTemplates();
				} catch (error) {
					const { message } = error as Error;
					addEvent({
						message,
						type: 'danger',
						autoclose: true,
					});
				}
				appStore.isLoading = false;
				deleteModalState.idToDelete = undefined;
			}
		});

		editModalState.onCancel$ = $(() => {
			editModalState.idToEdit = undefined;
		});

		editModalState.onConfirm$ = $(async () => {
			if (editModalState.idToEdit) {
				appStore.isLoading = true;
				try {
					const payload = {
						date_start: formatDateString(from.value),
						date_end: formatDateString(to.value),
						timehours: timeHours.value,
						daytime: daysSelected.value.map(dayOfWeekToNumber),
					};
					await updateTemplate(editModalState.idToEdit, payload);
					await fetchTemplates();
				} catch (error) {
					const { message } = error as Error;
					addEvent({
						message,
						type: 'danger',
						autoclose: true,
					});
				}

				appStore.isLoading = false;
				editModalState.idToEdit = undefined;
			}
		});
	});

	const handleTime = $((el: FocusEvent) => {
		const value = (el.target as HTMLInputElement).value;
		timeHours.value = convertTimeToDecimal(value);
	});

	return {
		deleteModalState,
		editModalState,
		openDeleteDialog,
		openEditDialog,
		customer,
		project,
		task,
		totalPlannedHours,
		from,
		to,
		daysSelected,
		timeHours,
		handleTime,
		templates,
	};
};
