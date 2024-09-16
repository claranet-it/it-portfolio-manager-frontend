import { $, Signal, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { ReportTab, ReportTimeEntry } from '@models/report';
import { AppContext } from 'src/app';
import { getReportTimeEntry } from 'src/services/report';
import { formatDateString } from 'src/utils/dates';

import { Task } from '@models/task';
import { UserProfile } from '@models/user';

export const useReportProject = (
	customer: Signal<Customer[]>,
	project: Signal<Project[]>,
	task: Signal<Task[]>,
	users: Signal<UserProfile[]>,
	from: Signal<Date>,
	to: Signal<Date>,
	tab: Signal<ReportTab>
) => {
	const appStore = useContext(AppContext);
	const results = useSignal<ReportTimeEntry[]>([]);

	const setFilters = $(async (data: ReportTimeEntry[]) => {
		let results = data;

		if (customer.value.length !== 0) {
			results = results.filter((entry) => customer.value.includes(entry.customer));
		}

		if (project.value.length !== 0) {
			results = results.filter((entry) =>
				project.value.map((proj) => proj.name).includes(entry.project.name)
			);
		}

		if (task.value.length !== 0) {
			results = results.filter((entry) =>
				task.value.map((task) => task.name).includes(entry.task.name)
			);
		}

		if (users.value.length !== 0) {
			results = results.filter((entry) =>
				users.value.map((user) => user.email).includes(entry.email)
			);
		}

		return results;
	});

	const fetchProjects = $(async () => {
		appStore.isLoading = true;
		try {
			const response = await getReportTimeEntry(
				formatDateString(from.value),
				formatDateString(to.value)
			);
			results.value = await setFilters(response);
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
		track(() => users.value);
		track(() => from.value);
		track(() => to.value);
		track(() => tab.value);
		(await fetchValidation()) && (await fetchProjects());
	});

	return { results };
};
