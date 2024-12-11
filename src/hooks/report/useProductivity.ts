import { $, Signal, useComputed$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { ReportProductivityItem, ReportTab } from '@models/report';
import { Task, TaskProjectCustomer } from '@models/task';
import { UserProfile } from '@models/user';
import { AppContext } from 'src/app';
import { getProductivity } from 'src/services/report';
import { getAllTasks } from 'src/services/tasks';
import { formatDateString } from 'src/utils/dates';

export const useProductivity = (
	customers: Signal<Customer[]>,
	projects: Signal<Project[]>,
	tasks: Signal<Task[]>,
	users: Signal<UserProfile[]>,
	from: Signal<Date>,
	to: Signal<Date>,
	tab: Signal<ReportTab>
) => {
	const appStore = useContext(AppContext);
	const results = useSignal<ReportProductivityItem[]>([]);
	const originalResults = useSignal<ReportProductivityItem[]>([]);

	const isRunning = useSignal(false);

	const taskProjectCustomerSig = useComputed$(async () => {
		return await getAllTasks();
	});

	const getProductivityResults = $(
		async (
			el: Partial<TaskProjectCustomer>,
			user: UserProfile | undefined,
			tempResults: ReportProductivityItem[]
		) => {
			try {
				const result = await getProductivity(
					el.customer ?? '',
					el.project ?? '',
					el.task ?? '',
					user?.name ?? '',
					formatDateString(from.value),
					formatDateString(to.value)
				);

				result.forEach((newData) => {
					// Gets index of existing user in tempResults array
					const existingUserIndex = tempResults.findIndex(
						(user) =>
							user.user.email === newData.user.email &&
							user.user.name === newData.user.name
					);
					// Gets existing user from tempResults array
					let existingUser =
						existingUserIndex !== -1 ? tempResults[existingUserIndex] : null;

					// If existing user exists, update it, else, add it to tempResults array
					if (existingUser !== null) {
						existingUser = {
							user: existingUser.user,
							workedHours: existingUser.workedHours + newData.workedHours,
							totalTracked: {
								billable:
									existingUser.totalTracked.billable +
									newData.totalTracked.billable,
								'non-billable':
									existingUser.totalTracked['non-billable'] +
									newData.totalTracked['non-billable'],
								'slack-time':
									existingUser.totalTracked['slack-time'] +
									newData.totalTracked['slack-time'],
								absence:
									existingUser.totalTracked.absence +
									newData.totalTracked.absence,
							},
							totalProductivity:
								existingUser.totalProductivity + newData.totalProductivity,
						};

						tempResults = [
							...tempResults.slice(0, existingUserIndex),
							existingUser,
							...tempResults.slice(existingUserIndex + 1, tempResults.length),
						];
					} else {
						tempResults =
							tempResults.length === 0 ? [newData] : [...tempResults, newData];
					}
				});
			} catch (error) {
				console.error(
					`Failed to get productivity for customer: ${el.customer}, project: ${el.project}, task: ${el.task}`,
					error
				);
			}

			return tempResults;
		}
	);

	const getBatchProductivity = $(async () => {
		let tempResults: ReportProductivityItem[] = [];

		if (
			customers.value.length === 0 &&
			projects.value.length === 0 &&
			tasks.value.length === 0
		) {
			tempResults = await getProductivityResults(
				{
					customer: '',
					project: '',
					task: '',
				},
				undefined,
				tempResults
			);
		} else {
			// Extract project and task names as strings
			const stringProjects = projects.value.map((proj) => proj.name);
			const stringTasks = tasks.value.map((task) => task.name);

			const arrayToCheck: Partial<TaskProjectCustomer>[] = taskProjectCustomerSig.value
				.filter((entry) => {
					const isCustomerIncluded =
						customers.value.length === 0 || customers.value.includes(entry.customer);
					const isProjectIncluded =
						stringProjects.length === 0 || stringProjects.includes(entry.project);
					const isTaskIncluded =
						stringTasks.length === 0 || stringTasks.includes(entry.task);

					return isCustomerIncluded && isProjectIncluded && isTaskIncluded;
				})
				.map((entry) => {
					// Task is selected, so return customer, project, and task
					if (stringTasks.length > 0) {
						return {
							customer: entry.customer,
							project: entry.project,
							task: entry.task,
						};
					}
					// Project is selected but no task, so return customer and project
					if (stringProjects.length > 0) {
						return {
							customer: entry.customer,
							project: entry.project,
							task: undefined,
						};
					}
					// Only customer is selected, so return customer only
					if (customers.value.length > 0) {
						return { customer: entry.customer, project: undefined, task: undefined };
					}
					return {
						customer: undefined,
						project: undefined,
						task: undefined,
					}; // Fallback return
				})
				.filter((entry) => entry !== null);

			for (let el of arrayToCheck) {
				tempResults = await getProductivityResults(el, undefined, tempResults);
			}
		}

		return tempResults;
	});

	const fetchProductivityResults = $(async () => {
		if (isRunning.value) return;
		isRunning.value = true;

		appStore.isLoading = true;

		try {
			results.value = originalResults.value = await getBatchProductivity();
		} catch (error) {
			const errorObject = error as Error;
			console.error(errorObject.message);
		}

		isRunning.value = false;
		appStore.isLoading = false;
	});

	const filterProductivity = $(() => {
		appStore.isLoading = true;

		if (users.value.length > 0) {
			results.value = originalResults.value.filter((tempResult) =>
				users.value.map((user) => user.email).includes(tempResult.user.email)
			);
		} else {
			results.value = originalResults.value;
		}

		appStore.isLoading = false;
	});

	const isRightTab = useComputed$(() => {
		return tab.value === 'productivity';
	});

	useTask$(async ({ track, cleanup }) => {
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		track(() =>
			JSON.stringify([
				customers.value,
				projects.value,
				tasks.value,
				from.value,
				to.value,
				tab.value,
			])
		);

		cleanup(() => {
			if (timeoutId) clearTimeout(timeoutId);
		});

		if (isRightTab.value) {
			timeoutId = setTimeout(async () => {
				await fetchProductivityResults();
			}, 300);
		}
	});

	useTask$(({ track }) => {
		track(() => users.value);
		filterProductivity();
	});

	return { results };
};
