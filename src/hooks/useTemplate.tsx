import { $, QRL, Signal, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { Template } from '@models/template';
import { Day, TimeEntryObject } from '@models/timeEntry';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
import { isInInterval } from 'src/utils/dateIntervals';
import { formatDateString } from 'src/utils/dates';

export const useTemplate = (
	templates: Signal<Template[] | undefined>,
	updateTimeEntries: QRL,
	days: Signal<Day[]>
) => {
	const appStore = useContext(AppContext);
	const formGroup = useStore(
		{} as { customer: Customer; project: Project; task?: Task; id: string }
	);

	const approvalModalState = useStore<ModalState & { id?: string }>({
		title: t('TEMPLATE_APPLYING'),
		confirmLabel: t('ACTION_APPLY'),
		cancelLabel: t('ACTION_CANCEL'),
		requiredLabel: true,
		onCancel$: $(() => {
			formGroup.task = undefined;
		}),
		onConfirm$: $(async () => {
			appStore.isLoading = true;

			const templateCurrent = templates?.value?.find((item) => item.id === formGroup.id);
			if (templateCurrent) {
				days.value.forEach((day) => {
					const formattedDate = formatDateString(day.date);
					const dayOfWeek = day.date.getDay();
					if (
						templateCurrent.daytime.includes(dayOfWeek) &&
						isInInterval(
							day.date,
							new Date(templateCurrent.date_start),
							new Date(templateCurrent.date_end)
						)
					) {
						const timeEntryObject: TimeEntryObject = {
							hours: templateCurrent.timehours,

							date: formattedDate,
							customer: formGroup.customer,
							project: formGroup.project,
							task: formGroup.task!,
						};

						updateTimeEntries(timeEntryObject);
					}
				});
			}
			appStore.isLoading = false;
			formGroup.task = undefined;
		}),
	});

	useTask$(({ track }) => {
		track(() => formGroup.task);
		approvalModalState.isConfirmDisabled = !formGroup.task;
	});

	const openApprovalTemplateDialog = $((id: string) => {
		approvalModalState.id = id;
		approvalModalState.isVisible = true;

		const element = templates.value?.find((item) => item.id === id);
		if (element) {
			formGroup.customer = element.customer;
			formGroup.project = element.project;
			formGroup.task = element.task;
			formGroup.id = id;
		}
	});

	return { formGroup, approvalModalState, openApprovalTemplateDialog };
};
