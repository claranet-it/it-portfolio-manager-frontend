import { $, Signal, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { ReportProductivityItem, RepotTab } from '@models/report';
import { Task } from '@models/task';
import { AppContext } from 'src/app';
import { getProductivity } from 'src/services/report';
import { INIT_PROJECT_VALUE } from 'src/utils/constants';
import { formatDateString } from 'src/utils/dates';
import { useDebounce } from '../useDebounce';

export const useProductivity = (
	customer: Signal<Customer>,
	project: Signal<Project>,
	task: Signal<Task>,
	name: Signal<String>,
	from: Signal<Date>,
	to: Signal<Date>,
	tab: Signal<RepotTab>
) => {
	const appStore = useContext(AppContext);
	const results = useStore<{ data: ReportProductivityItem[] }>({ data: [] });
	const nameDebunce = useDebounce(name, 300);

	const featchProductivityResults = $(async () => {
		appStore.isLoading = true;
		try {
			results.data = await getProductivity(
				customer.value,
				project.value,
				task.value,
				nameDebunce.value.toLowerCase(),
				formatDateString(from.value),
				formatDateString(to.value)
			);
		} catch (error) {
			const errorObject = error as Error;
			console.error(errorObject.message);
		}
		appStore.isLoading = false;
	});

	const fetchValidation = $((): boolean => {
		if (project.value !== INIT_PROJECT_VALUE && customer.value === '') return false;

		if (tab.value !== 'productivity') return false;

		return true;
	});

	useTask$(async ({ track }) => {
		track(() => customer.value);
		track(() => project.value);
		track(() => task.value);
		track(() => nameDebunce.value);
		track(() => from.value);
		track(() => to.value);
		track(() => tab.value);
		(await fetchValidation()) && featchProductivityResults();
	});

	return { results };
};
