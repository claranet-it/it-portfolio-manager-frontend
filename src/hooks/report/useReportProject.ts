import { $, Signal, useComputed$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { ReportTab, ReportTimeEntry } from '@models/report';
import { AppContext } from 'src/app';
import { formatDateString } from 'src/utils/dates';

import { Task } from '@models/task';
import { UserProfile } from '@models/user';
import { ToggleState } from 'src/components/form/RadioDropdown';
import { getReportTimeEntry } from 'src/services/report';
import { WORK_END_HOUR, WORK_START_HOUR } from 'src/utils/constants';

export const useReportProject = (
	customer: Signal<Customer[]>,
	project: Signal<Project[]>,
	task: Signal<Task[]>,
	users: Signal<UserProfile[]>,
	afterHours: Signal<ToggleState>,
	from: Signal<Date>,
	to: Signal<Date>,
	tab: Signal<ReportTab>
) => {
	const appStore = useContext(AppContext);
	const results = useSignal<ReportTimeEntry[]>([]);

	const setFilters = $(async (data: ReportTimeEntry[]) => {
		let results = data;

		const timeToMinutes = (time: string): number => {
			const [hours, minutes] = time.split(':').map(Number);
			return hours * 60 + minutes;
		};

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

		if (afterHours.value === ToggleState.On) {
			results = results.filter((entry) => {
				if (
					(entry.startHour === '00:00' || !entry.startHour) &&
					(entry.endHour === '00:00' || !entry.endHour)
				) {
					return false;
				}

				const taskStartMinutes = timeToMinutes(entry.startHour ?? '00:00');
				const taskEndMinutes = timeToMinutes(entry.endHour ?? '00:00');
				const workStartMinutes = timeToMinutes(WORK_START_HOUR);
				const workEndMinutes = timeToMinutes(WORK_END_HOUR);

				const startsOutside =
					taskStartMinutes < workStartMinutes || taskStartMinutes > workEndMinutes;
				const endsOutside =
					taskEndMinutes < workStartMinutes || taskEndMinutes > workEndMinutes;

				return startsOutside || endsOutside;
			});
		} else if (afterHours.value === ToggleState.Off) {
			results = results.filter((entry) => {
				if (
					(entry.startHour === '00:00' || !entry.startHour) &&
					(entry.endHour === '00:00' || !entry.endHour)
				) {
					return true;
				}

				const taskStartMinutes = timeToMinutes(entry.startHour ?? '00:00');
				const taskEndMinutes = timeToMinutes(entry.endHour ?? '00:00');
				const workStartMinutes = timeToMinutes(WORK_START_HOUR);
				const workEndMinutes = timeToMinutes(WORK_END_HOUR);

				const startsInside =
					taskStartMinutes >= workStartMinutes && taskStartMinutes <= workEndMinutes;
				const endsInside =
					taskEndMinutes >= workStartMinutes && taskEndMinutes <= workEndMinutes;

				return startsInside && endsInside;
			});
		}

		return results;
	});

	const fetchProjects = $(async () => {
		appStore.isLoading = true;

		try {
			const startDate = new Date(from.value);
			const endDate = new Date(to.value);

			let current = new Date(startDate);
			let calls = [];

			while (current <= endDate) {
				const endOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0);

				const rangeStart = formatDateString(current);
				const rangeEnd = formatDateString(endOfMonth < endDate ? endOfMonth : endDate);

				calls.push(getReportTimeEntry(rangeStart, rangeEnd));

				current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
			}
			const responses = await Promise.all(calls);
			results.value = await setFilters(responses.flat());
		} catch (error) {
			const errorObject = error as Error;
			console.error(errorObject.message);
		}

		appStore.isLoading = false;
	});

	const isRightTab = useComputed$(() => {
		return tab.value === 'project';
	});

	useVisibleTask$(async ({ track, cleanup }) => {
		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		let isFetching = false;

		track(() =>
			JSON.stringify([
				customer.value,
				project.value,
				task.value,
				users.value,
				afterHours.value,
				from.value,
				to.value,
				tab.value,
			])
		);

		cleanup(() => {
			if (timeoutId) clearTimeout(timeoutId);
		});

		if (isRightTab.value && !isFetching) {
			isFetching = true;

			timeoutId = setTimeout(async () => {
				await fetchProjects();
				isFetching = false;
			}, 500);
		}
	});

	return { results };
};
