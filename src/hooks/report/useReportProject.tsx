import { $, Signal, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { ReportTimeEntry, RepotTab } from '@models/report';
import { AppContext } from 'src/app';
import { getReportTimeEntry } from 'src/services/report';
import { formatDateString } from 'src/utils/dates';

import { Task } from '@models/task';
import { useDebounce } from '../useDebounce';

export const useReportProject = (
	customer: Signal<Customer>,
	project: Signal<Project>,
	task: Signal<Task>,
	name: Signal<String>,
	from: Signal<Date>,
	to: Signal<Date>,
	tab: Signal<RepotTab>
) => {
	const appStore = useContext(AppContext);
	const results = useStore<{ data: ReportTimeEntry[] }>({ data: [] });
	const originResults = useStore<{ data: ReportTimeEntry[] }>({ data: [] });
	const nameDebunce = useDebounce(name, 300);

	const setFilters = $(async (data: ReportTimeEntry[]) => {
		let results = data;

		if (customer.value != '') {
			results = results.filter((entry) => entry.customer === customer.value);
		}

		if (project.value.name != '') {
			results = results.filter((entry) => entry.project.name === project.value.name);
		}

		if (task.value != '') {
			results = results.filter((entry) => entry.task === task.value);
		}

		if (nameDebunce.value) {
			results = results.filter((entry) => entry.email.includes(nameDebunce.value));
		}

		return results;
	});

	const featchProjets = $(async () => {
		appStore.isLoading = true;
		try {
			const response = await getReportTimeEntry(
				formatDateString(from.value),
				formatDateString(to.value)
			);
			originResults.data = results.data = await setFilters(response);
		} catch (error) {
			const errorObject = error as Error;
			console.error(errorObject.message);
		}

		appStore.isLoading = false;
	});

	const fetchValidation = $((): boolean => {
		if (tab.value !== 'project') return false;

		return true;
	});

	useVisibleTask$(async ({ track }) => {
		track(() => customer.value);
		track(() => project.value);
		track(() => task.value);
		track(() => nameDebunce.value);
		track(() => from.value);
		track(() => to.value);
		track(() => tab.value);
		(await fetchValidation()) && (await featchProjets());
	});

	return { results };
};
