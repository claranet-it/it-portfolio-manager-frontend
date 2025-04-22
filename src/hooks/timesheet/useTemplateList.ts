import { $, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { t } from 'src/locale/labels';
import { convertTimeToDecimal } from 'src/utils/timesheet';

export const useTemplateList = () => {
	/* TODO hook dedicato: portare tutta questa parte in un componente a se */
	var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const daysSelected = useSignal<string[]>([]);
	const description = useSignal<string>('');
	const timeHours = useSignal<number>(0);
	const from = useSignal<Date>(new Date());
	const to = useSignal<Date>(new Date());
	const templateList = useSignal([
		{
			id: '1',
			start_date: '2025-04-14',
			end_date: '2025-04-30',
			repeat: [1, 2, 3, 4, 5],
			hours: 8,
			description: 'Prova',
			customer: 'Claranet',
			project: { completed: false, name: 'Assenze', plannedHours: 100, type: 'absence' },
			task: { completed: false, name: 'ALLATTAMENTO', plannedHours: 0 },
		},
		{
			id: '2',
			start_date: '2025-04-20',
			end_date: '2025-05-20',
			repeat: [0, 1],
			hours: 8,
			description: 'Prova',
			customer: 'Claranet',
			project: { completed: false, name: 'Assenze', plannedHours: 100, type: 'absence' },
			task: { completed: false, name: 'ALLATTAMENTO', plannedHours: 0 },
		},
	]);

	const totalPlannedHours = $(
		(template: {
			id: string;
			start_date: string;
			end_date: string;
			repeat: number[];
			hours: number;
			description: string;
			customer: string;
			project: { completed: boolean; name: string; plannedHours: number; type: string };
			task: { completed: boolean; name: string; plannedHours: number };
		}) => {
			const fromDate = new Date(template.start_date);
			const toDate = new Date(template.end_date);
			const startDate = new Date(fromDate);

			let totalHours = 0;
			while (startDate <= toDate) {
				if (template.repeat.includes(startDate.getDay())) {
					totalHours += template.hours;
				}
				startDate.setDate(startDate.getDate() + 1);
			}

			return totalHours;
		}
	);

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
	});

	const openDeleteDialog = $((id: string) => {
		deleteModalState.idToDelete = id;
		deleteModalState.isVisible = true;
	});

	const openEditDialog = $((id: string) => {
		editModalState.idToEdit = id;
		const template = templateList.value?.find((item) => item.id === id);
		if (template) {
			from.value = new Date(template.start_date);
			to.value = new Date(template.end_date);

			timeHours.value = template.hours;
			description.value = template.description;
			daysSelected.value = template.repeat.map((id) => daysOfWeek[id]);
		}
		editModalState.isVisible = true;
	});

	useTask$(() => {
		deleteModalState.onCancel$ = $(() => {
			deleteModalState.idToDelete = undefined;
		});

		deleteModalState.onConfirm$ = $(async () => {
			if (deleteModalState.idToDelete) {
				/*         appStore.isLoading = true;
                        await onDelete(deleteModalState.workIdToDelete);
                        appStore.isLoading = false; */
				deleteModalState.idToDelete = undefined;
			}
		});

		editModalState.onCancel$ = $(() => {
			editModalState.idToEdit = undefined;
		});

		editModalState.onConfirm$ = $(async () => {
			if (editModalState.idToEdit) {
				/*         appStore.isLoading = true;
                        await onEdit(deleteModalState.workIdToDelete);
                        appStore.isLoading = false; */
				editModalState.idToEdit = undefined;
			}
		});
	});

	const handleTime = $((el: FocusEvent) => {
		const value = (el.target as HTMLInputElement).value;
		timeHours.value = convertTimeToDecimal(value);
	});

	return {
		templateList,
		daysOfWeek,
		deleteModalState,
		editModalState,
		openDeleteDialog,
		openEditDialog,
		totalPlannedHours,
		from,
		to,
		daysSelected,
		description,
		timeHours,
		handleTime,
	};
};
