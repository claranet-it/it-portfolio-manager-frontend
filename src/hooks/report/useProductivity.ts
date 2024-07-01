import { $, Signal, useSignal, useTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { ReportProductivityItem } from '@models/report';
import { Task } from '@models/task';
import { getProductivity } from 'src/services/report';
import { formatDateString } from 'src/utils/dates';
import { useDebounce } from '../useDebounce';

export const useProductivity = (
	customer: Signal<Customer>,
	project: Signal<Project>,
	task: Signal<Task>,
	name: Signal<String>,
	from: Signal<Date>,
	to: Signal<Date>
) => {
	const isLoading = useSignal(false);
	const results = useSignal<ReportProductivityItem[]>([]);
	const nameDebunce = useDebounce(name, 300);

	const loadProductivityResults = $(async () => {
		isLoading.value = true;
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
		isLoading.value = false;
	});

	useTask$(({ track }) => {
		track(() => customer.value);
		track(() => project.value);
		track(() => task.value);
		track(() => nameDebunce.value);
		track(() => from.value);
		track(() => to.value);
		loadProductivityResults();
	});

	return { isLoading, loadProductivityResults, results };
};
