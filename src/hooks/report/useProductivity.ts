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

	const isRunning = useSignal(false);

	const taskProjectCustomerSig = useComputed$(async () => {
		return await getAllTasks();
	});

	const getProductivityResults = $(
		async (
			el: TaskProjectCustomer,
			user: UserProfile | undefined,
			tempResults: ReportProductivityItem[]
		) => {
			try {
				const result = await getProductivity(
					el.customer,
					el.project,
					el.task,
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
					if (existingUser) {
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
						tempResults = tempResults.length === 0 ? result : [...tempResults, newData];
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

		// Extract project and task names as strings
		const stringProjects = projects.value.map((proj) => proj.name);
		const stringTasks = tasks.value.map((task) => task.name);

		// Filter taskProjectCustomerSig based on the customer, project, and task conditions
		const arrayToCheck = taskProjectCustomerSig.value.filter((entry) => {
			const isCustomerIncluded =
				customers.value.length === 0 || customers.value.includes(entry.customer);
			const isProjectIncluded =
				stringProjects.length === 0 || stringProjects.includes(entry.project);
			const isTaskIncluded = stringTasks.length === 0 || stringTasks.includes(entry.task);

			return isCustomerIncluded && isProjectIncluded && isTaskIncluded;
		});

		const hasUsers = users.value.length > 0;

		for (let el of arrayToCheck) {
			if (hasUsers) {
				const userProductivityPromises = users.value.map((user) =>
					getProductivityResults(el, user, tempResults)
				);
				const results = await Promise.all(userProductivityPromises);
				tempResults = results.flat();
			} else {
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
			results.value = await getBatchProductivity();
		} catch (error) {
			const errorObject = error as Error;
			console.error(errorObject.message);
		}

		isRunning.value = false;
		appStore.isLoading = false;
	});

	const fetchValidation = $((): boolean => {
		if (tab.value !== 'productivity') return false;

		return true;
	});

	useTask$(async ({ track }) => {
		track(() => customers.value);
		track(() => projects.value);
		track(() => tasks.value);
		track(() => users.value);
		track(() => from.value);
		track(() => to.value);
		track(() => tab.value);
		(await fetchValidation()) && fetchProductivityResults();
	});

	return { results };
};
