import { $, Signal, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { ReportProductivityItem, RepotTab } from '@models/report';
import { Task } from '@models/task';
import { AppContext } from 'src/app';
import { getProductivity } from 'src/services/report';
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
	const results = useSignal<ReportProductivityItem[]>([]);
	const nameDebunce = useDebounce(name, 300);

	const loadProductivityResults = $(async () => {
		appStore.isLoading = true;
		try {
			results.value = await getProductivity(
				customer.value,
				project.value,
				task.value,
				nameDebunce.value,
				formatDateString(from.value),
				formatDateString(to.value)
			);
		} catch (error) {
			const errorObject = error as Error;
			console.error(errorObject.message);
		}
		appStore.isLoading = false;
	});

	useTask$(({ track }) => {
		track(() => customer.value);
		track(() => project.value);
		track(() => task.value);
		track(() => nameDebunce.value);
		track(() => from.value);
		track(() => to.value);
		track(() => tab.value);
		tab.value === 'productivity' && loadProductivityResults();
	});

	return { loadProductivityResults, results };
};
