import {
	$,
	Signal,
	component$,
	sync$,
	useComputed$,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { ReportTab } from '@models/report';
import { Task } from '@models/task';
import { UserProfile } from '@models/user';
import { t } from 'src/locale/labels';
import { getRouteParams } from 'src/router';
import { getProjects } from 'src/services/projects';
import { getAllTasks, getTasks } from 'src/services/tasks';
import { getUserProfiles } from 'src/services/user';
import { parametersHandler } from 'src/utils/report';
import { UUID } from 'src/utils/uuid';
import { Button } from '../Button';
import { MultiselectCustom } from '../form/MultiselectCustom';
import { GroupedOptions, Option } from '../form/MultiselectDropdownMenu';
import { RadioDropdown, ToggleState } from '../form/RadioDropdown';

export const ReportFilters = component$<{
	selectedCustomers: Signal<Customer[]>;
	selectedProjects: Signal<Project[]>;
	selectedTasks: Signal<Task[]>;
	selectedUsers: Signal<UserProfile[]>;
	afterHoursSig: Signal<ToggleState>;
	selectedTab: Signal<ReportTab>;
}>(
	({
		selectedCustomers,
		selectedProjects,
		selectedTasks,
		selectedUsers,
		afterHoursSig,
		selectedTab,
	}) => {
		const getUniqueValues = sync$((arr: Option[]): Option[] => {
			return arr.filter(
				(value, index, self) => self.findIndex((v) => v.id === value.id) === index
			);
		});

		const _selectedCustomers = useSignal<Option[]>(
			selectedCustomers.value.map((customer) => {
				return { id: customer.id, name: customer.name };
			})
		);
		const _selectedProjects = useSignal(
			selectedProjects.value.map((project) => {
				return { id: project.id, name: project.name };
			})
		);
		const _selectedTasks = useSignal(
			selectedTasks.value.map((task) => {
				return { id: task.id, name: task.name };
			})
		);

		const _selectedUsers = useSignal(
			selectedUsers.value.map((user) => {
				return { id: user.id, name: user.name };
			})
		);

		const taskProjectCustomerSig = useComputed$(async () => {
			return await getAllTasks();
		});

		const usersSig = useComputed$(async () => {
			return (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
		});

		const _usersOptionsSig = useComputed$(async () => {
			return usersSig.value.map((user) => {
				return { id: user.id, name: user.name };
			});
		});

		const _customerOptionsSig = useComputed$(async () => {
			return getUniqueValues(
				taskProjectCustomerSig.value
					.map((taskProjectCustomer) => {
						return {
							id: taskProjectCustomer.customer.id,
							name: taskProjectCustomer.customer.name,
						};
					})
					.sort((a, b) => a.name.localeCompare(b.name))
			);
		});

		const _projectOptionsSig = useComputed$(async () => {
			let customerProjects;

			const customerIds = selectedCustomers.value.map((customer) => customer.id);
			if (selectedCustomers.value.length !== 0) {
				customerProjects = taskProjectCustomerSig.value.filter((element) => {
					return customerIds.includes(element.customer.id);
				});
			} else {
				customerProjects = taskProjectCustomerSig.value;
			}

			return getUniqueValues(
				customerProjects
					.map((taskProjectCustomer) => {
						return {
							group: taskProjectCustomer.customer.name,
							id: taskProjectCustomer.project.id,
							name: taskProjectCustomer.project.name,
						};
					})
					.sort((a, b) => {
						if (a.group === b.group) {
							return a.name.localeCompare(b.name);
						} else {
							return a.group.localeCompare(b.group);
						}
					})
			);
		});

		const _taskOptionsSig = useComputed$(async () => {
			let taskProjects;

			if (selectedProjects.value.length !== 0) {
				const projectIds = selectedProjects.value.map((project) => project.id);
				taskProjects = taskProjectCustomerSig.value.filter(
					(element) =>
						projectIds.includes(element.project.id) &&
						_projectOptionsSig.value.map((e) => e.id).includes(element.project.id)
				);
			} else if (selectedCustomers.value.length !== 0) {
				taskProjects = taskProjectCustomerSig.value.filter((element) =>
					selectedCustomers.value
						.map((customer) => customer.id)
						.includes(element.customer.id)
				);
			} else {
				taskProjects = taskProjectCustomerSig.value;
			}

			return taskProjects
				.map((taskProjectCustomer) => {
					return {
						group: taskProjectCustomer.project.name,
						id: taskProjectCustomer.task.id,
						name: taskProjectCustomer.task.name,
					};
				})
				.sort((a, b) => {
					if (a.group === b.group) {
						return a.name.localeCompare(b.name);
					} else {
						return a.group.localeCompare(b.group);
					}
				});
		});

		const isFullySelected = $(
			(original: string[], selected: string[]) =>
				selected.length > 0 &&
				original.length > 0 &&
				original.length === selected.length &&
				original.every((element) => selected.includes(element))
		);

		const getProjectSig = $(async (projectID: string) => {
			const customer = taskProjectCustomerSig.value.find(
				(value) => value.project.id === projectID
			)?.customer;
			if (customer) {
				const customerProjectList = await getProjects(customer);
				return customerProjectList.find((element) => element.id === projectID);
			}
		});

		const getTaskSig = $(async (taskID: string) => {
			let taskProjects;

			if (selectedProjects.value.length !== 0) {
				const projectIds = selectedProjects.value.map((project) => project.id);
				taskProjects = taskProjectCustomerSig.value.filter(
					(element) =>
						projectIds.includes(element.project.id) &&
						_projectOptionsSig.value
							.map((project) => project.id)
							.includes(element.project.id)
				);
			} else if (selectedCustomers.value.length !== 0) {
				taskProjects = taskProjectCustomerSig.value.filter((element) =>
					selectedCustomers.value
						.map((customer) => customer.id)
						.includes(element.customer.id)
				);
			} else {
				taskProjects = taskProjectCustomerSig.value;
			}

			const project = taskProjects.find((value) => value.task.id === taskID)?.project;
			const customer = taskProjects.find(
				(value) => value.project.id === project?.id
			)?.customer;

			if (customer && project) {
				const projectTaskList = await getTasks(customer, project);
				return projectTaskList.find((element) => element.id === taskID);
			}
		});

		const onChangeTask = $(async () => {
			const selectedTaskIds = selectedTasks.value.map((task) => task.id);
			const tasksToAdd = _selectedTasks.value.filter(
				(task) => !selectedTaskIds.includes(task.id)
			);

			if (tasksToAdd.length > 0) {
				for (const currentTask of tasksToAdd) {
					const task = await getTaskSig(currentTask.id);
					selectedTasks.value = [
						...selectedTasks.value,
						task ?? {
							id: currentTask.id,
							name: currentTask.name,
							completed: false,
							plannedHours: 0,
						},
					];
				}
			} else {
				const tasksToRemove = selectedTasks.value.filter(
					(task) => !_selectedTasks.value.map((e) => e.id).includes(task.id)
				);

				selectedTasks.value = selectedTasks.value.filter(
					(task) => !tasksToRemove.map((e) => e.id).includes(task.id)
				);
			}
			const isAllSelected = await isFullySelected(
				_taskOptionsSig.value.map((e) => e.id),
				_selectedTasks.value.map((e) => e.id)
			);

			parametersHandler(
				'task',
				isAllSelected ? ['all'] : selectedTasks.value.map((task) => task.name)
			);
		});

		const onChangeCustomer = $(async () => {
			const selectedCustomerIds = selectedCustomers.value.map((cust) => cust.id);
			const customersToAdd = _selectedCustomers.value.filter(
				(customerOpt) => !selectedCustomerIds.includes(customerOpt.id)
			);
			if (customersToAdd.length > 0) {
				for (const customer of customersToAdd) {
					selectedCustomers.value = [...selectedCustomers.value, customer];
				}
			} else {
				const customersToRemove = selectedCustomers.value.filter(
					(cust) => !_selectedCustomers.value.map((e) => e.id).includes(cust.id)
				);

				selectedCustomers.value = selectedCustomers.value.filter(
					(cust) => !customersToRemove.map((e) => e.id).includes(cust.id)
				);
			}

			const isAllSelected = await isFullySelected(
				_customerOptionsSig.value.map((e) => e.id),
				_selectedCustomers.value.map((e) => e.id)
			);

			parametersHandler(
				'customer',
				isAllSelected ? ['all'] : selectedCustomers.value.map((cust) => cust.name)
			);
		});

		const onChangeProject = $(async () => {
			const selectedProjectIds = selectedProjects.value.map((proj) => proj.id);
			const projectsToAdd = _selectedProjects.value.filter(
				(proj) => !selectedProjectIds.includes(proj.id)
			);

			if (projectsToAdd.length > 0) {
				for (const proj of projectsToAdd) {
					const project = await getProjectSig(proj.id);
					selectedProjects.value = [
						...selectedProjects.value,
						project ?? {
							id: proj.id,
							name: proj.name,
							type: '',
							plannedHours: 0,
							completed: false,
						},
					];
				}
			} else {
				const projectsToRemove = selectedProjects.value.filter(
					(proj) => !_selectedProjects.value.map((e) => e.id).includes(proj.id)
				);

				selectedProjects.value = selectedProjects.value.filter(
					(proj) => !projectsToRemove.map((e) => e.id).includes(proj.id)
				);
			}
			const isAllSelected = await isFullySelected(
				_projectOptionsSig.value.map((e) => e.id),
				_selectedProjects.value.map((e) => e.id)
			);

			if (selectedProjects.value.length === 0) {
				_selectedTasks.value = [];
			}

			parametersHandler(
				'project',
				isAllSelected ? ['all'] : selectedProjects.value.map((proj) => proj.name)
			);
		});

		const convertToGrouped = useComputed$(() => {
			const teamsMap: Record<string, Option[]> = usersSig.value.reduce(
				(map, user) => {
					if (!map[user.crew]) {
						map[user.crew] = [];
					}
					map[user.crew].push({ id: user.id, name: user.name });
					return map;
				},
				{} as Record<string, Option[]>
			);

			const teams: GroupedOptions[] = Object.keys(teamsMap).map((teamName) => ({
				key: teamName,
				options: teamsMap[teamName],
			}));

			return teams;
		});

		const handleUserCrews = sync$(async () => {
			const newParams = {
				crew: [] as string[],
				users: [] as string[],
			};

			const selectedUserNames = new Set(selectedUsers.value.map((user) => user.name));

			for (const user of selectedUsers.value) {
				const userCrew = user.crew;
				const crewMembers = convertToGrouped.value.find(
					(element) => element.key === userCrew
				)?.options;

				if (crewMembers) {
					const allMembersSelected = crewMembers.every((member) =>
						selectedUserNames.has(member.name)
					);

					if (allMembersSelected) {
						newParams.crew.push(userCrew);
					} else {
						newParams.users.push(user.name);
					}
				}
			}
			const isAllSelected = await isFullySelected(
				usersSig.value.map((user) => user.id),
				_selectedUsers.value.map((user) => user.id)
			);
			parametersHandler('crew', isAllSelected ? [] : newParams.crew);
			parametersHandler('users', isAllSelected ? ['all'] : newParams.users);
		});

		const onChangeUser = $(() => {
			selectedUsers.value = _selectedUsers.value.map((user) => {
				const value = usersSig.value.find((element) => element.name === user.name);
				return (
					value ?? {
						name: user.name,
						email: '',
						id: user.id,
						crew: '',
					}
				);
			});

			handleUserCrews();
		});

		const clearFilters = $(() => {
			_selectedCustomers.value = [];
			_selectedProjects.value = [];
			_selectedTasks.value = [];
			_selectedUsers.value = [];
			afterHoursSig.value = ToggleState.Intermediate;
		});

		useVisibleTask$(() => {
			const params = getRouteParams();

			// Function to add matching items from params to the selected list
			const addMatchingItems = (
				paramKey: keyof typeof params,
				optionsSig: Signal<Option[]>,
				selectedList: Signal<Option[]>
			) => {
				if (!(params[paramKey] && params[paramKey][0] === 'all')) {
					params[paramKey]?.forEach((item) => {
						const matchedItem = optionsSig.value.find(
							(option) => option.name.toLowerCase() === item.toLowerCase()
						);
						if (matchedItem) selectedList.value = [...selectedList.value, matchedItem];
					});
				}
			};

			// Apply filtering for each parameter
			addMatchingItems('customer', _customerOptionsSig, _selectedCustomers);
			addMatchingItems('project', _projectOptionsSig, _selectedProjects);
			addMatchingItems('task', _taskOptionsSig, _selectedTasks);
			addMatchingItems('users', _usersOptionsSig, _selectedUsers);

			// Special handling for 'crew' parameter with custom logic
			params['crew']?.forEach((item) => {
				const matchedCrew = usersSig.value
					.filter((user) => user.crew.toLowerCase() === item.toLowerCase())
					.map((user) => {
						return { id: user.id, name: user.name };
					});
				if (matchedCrew) _selectedUsers.value = [..._selectedUsers.value, ...matchedCrew];
			});

			// Set afterHours toggle state
			if (params['afterHours']) {
				afterHoursSig.value =
					(params['afterHours'][0] as ToggleState) || ToggleState.Intermediate;
			}
		});

		return (
			<div class='m-0 flex w-full grid-cols-6 flex-col gap-1 sm:space-y-2 md:space-y-2 lg:grid lg:items-end md:[&>form]:!mx-0'>
				<MultiselectCustom
					key={_customerOptionsSig.value.length}
					id={UUID() + '-filter-customer'}
					label={t('CUSTOMER_LABEL')}
					placeholder={t('select_empty_label')}
					selectedValues={_selectedCustomers}
					options={_customerOptionsSig}
					onChange$={onChangeCustomer}
					allowSelectAll
					size='auto'
				/>

				<MultiselectCustom
					key={_projectOptionsSig.value.length}
					id={UUID() + '-filter-project'}
					label={t('PROJECT_LABEL')}
					placeholder={t('select_empty_label')}
					selectedValues={_selectedProjects}
					options={_projectOptionsSig}
					onChange$={onChangeProject}
					allowSelectAll
					size='auto'
				/>

				<MultiselectCustom
					key={_taskOptionsSig.value.length}
					id={UUID() + '-filter-task'}
					label={t('TASK_LABEL')}
					placeholder={t('select_empty_label')}
					selectedValues={_selectedTasks}
					options={_taskOptionsSig}
					onChange$={onChangeTask}
					allowSelectAll
					size='auto'
					disabled={!_selectedProjects.value.length}
				/>

				<MultiselectCustom
					key={_usersOptionsSig.value.length}
					id={UUID() + '-filter-user'}
					label={t('USER_LABEL')}
					placeholder={t('select_empty_label')}
					selectedValues={_selectedUsers}
					options={_usersOptionsSig}
					multiLevel={[
						{
							label: t('crew'),
							options: convertToGrouped,
						},
					]}
					onChange$={onChangeUser}
					allowSelectAll
					size='auto'
				/>

				<div class='mx-0 flex items-end'>
					<Button variant={'outline'} size={'small'} onClick$={clearFilters}>
						{t('CLEAR_ALL_FILTERS_LABEL')}
					</Button>
				</div>

				{selectedTab.value === 'project' && (
					<div class='mx-0 flex items-end justify-end'>
						<RadioDropdown
							id={UUID() + '-afterHours'}
							label={t('TIMESHEET_REPORT_HOURS_LABEL')}
							value={afterHoursSig}
							options={[
								{
									title: t('TIMESHEET_REPORT_ALL_TITLE'),
									value: ToggleState.Intermediate,
									body: t('TIMESHEET_REPORT_ALL_BODY'),
								},
								{
									title: t('TIMESHEET_REPORT_WORK_HOURS_ONLY_TITLE'),
									value: ToggleState.Off,
									body: t('TIMESHEET_REPORT_WORK_HOURS_ONLY_BODY'),
								},
								{
									title: t('TIMESHEET_REPORT_AFTER_HOURS_ONLY_TITLE'),
									value: ToggleState.On,
									body: t('TIMESHEET_REPORT_AFTER_HOURS_ONLY_BODY'),
								},
							]}
						/>
					</div>
				)}
			</div>
		);
	}
);
