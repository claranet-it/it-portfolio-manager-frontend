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
import { GroupedValues, Multiselect } from '../form/Multiselect';
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
		const getUniqueValues = sync$((arr: string[]): string[] => {
			return [...new Set(arr)];
		});

		const _selectedCustomers = useSignal(
			selectedCustomers.value.map((customer) => customer.name)
		);
		const _selectedProjects = useSignal(selectedProjects.value.map((project) => project.name));
		const _selectedTasks = useSignal(selectedTasks.value.map((task) => task.name));
		const _selectedUsers = useSignal(selectedUsers.value.map((user) => user.name));

		const taskProjectCustomerSig = useComputed$(async () => {
			return await getAllTasks();
		});

		const usersSig = useComputed$(async () => {
			return (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
		});

		const _usersOptionsSig = useComputed$(async () => {
			return usersSig.value.map((user) => user.name);
		});

		const _customerOptionsSig = useComputed$(async () => {
			return getUniqueValues(
				taskProjectCustomerSig.value
					.map((taskProjectCustomer) => taskProjectCustomer.customer.name)
					.sort((a, b) => a.localeCompare(b))
			);
		});

		const _projectOptionsSig = useComputed$(async () => {
			let customerProjects;

			const customerNames = selectedCustomers.value.map((customer) => customer.name);
			if (selectedCustomers.value.length !== 0) {
				customerProjects = taskProjectCustomerSig.value.filter(
					(element) =>
						customerNames.includes(element.customer.name) &&
						_customerOptionsSig.value.includes(element.customer.name)
				);
			} else {
				customerProjects = taskProjectCustomerSig.value;
			}

			return getUniqueValues(
				customerProjects
					.map((taskProjectCustomer) => taskProjectCustomer.project.name)
					.sort((a, b) => a.localeCompare(b))
			);
		});

		const _taskOptionsSig = useComputed$(async () => {
			let taskProjects;

			if (selectedProjects.value.length !== 0) {
				const projectNames = selectedProjects.value.map((project) => project.name);
				taskProjects = taskProjectCustomerSig.value.filter(
					(element) =>
						projectNames.includes(element.project.name) &&
						_projectOptionsSig.value.includes(element.project.name)
				);
			} else if (selectedCustomers.value.length !== 0) {
				taskProjects = taskProjectCustomerSig.value.filter((element) =>
					selectedCustomers.value
						.map((customer) => customer.name)
						.includes(element.customer.name)
				);
			} else {
				taskProjects = taskProjectCustomerSig.value;
			}

			return taskProjects
				.map((taskProjectCustomer) => taskProjectCustomer.task.name)
				.sort((a, b) => a.localeCompare(b));
		});

		const isFullySelected = $(
			(original: string[], selected: string[]) =>
				selected.length > 0 &&
				original.length > 0 &&
				original.length === selected.length &&
				original.every((element) => selected.includes(element))
		);

		const getCustomerSig = $(async (customerName: string) => {
			return taskProjectCustomerSig.value.find(
				(value) => value.customer.name === customerName
			)?.customer;
		});

		const getProjectSig = $(async (project: string) => {
			const customer = taskProjectCustomerSig.value.find(
				(value) => value.project.name === project
			)?.customer;
			if (customer) {
				const customerProjectList = await getProjects(customer);
				return customerProjectList.find((element) => element.name === project);
			}
		});

		const getTaskSig = $(async (task: string) => {
			let taskProjects;

			if (selectedProjects.value.length !== 0) {
				const projectNames = selectedProjects.value.map((project) => project.name);
				taskProjects = taskProjectCustomerSig.value.filter(
					(element) =>
						projectNames.includes(element.project.name) &&
						_projectOptionsSig.value.includes(element.project.name)
				);
			} else if (selectedCustomers.value.length !== 0) {
				taskProjects = taskProjectCustomerSig.value.filter((element) =>
					selectedCustomers.value
						.map((customer) => customer.name)
						.includes(element.customer.name)
				);
			} else {
				taskProjects = taskProjectCustomerSig.value;
			}

			const project = taskProjects.find((value) => value.task.name === task)?.project;
			const customer = taskProjects.find((value) => value.project === project)?.customer;

			if (customer && project) {
				const projectTaskList = await getTasks(customer, project);
				return projectTaskList.find((element) => element.name === task);
			}
		});

		const onChangeTask = $(async () => {
			const selectedTaskNames = selectedTasks.value.map((task) => task.name);
			const tasksToAdd = _selectedTasks.value.filter(
				(taskName) => !selectedTaskNames.includes(taskName)
			);

			if (tasksToAdd.length > 0) {
				for (const taskName of tasksToAdd) {
					const task = await getTaskSig(taskName);
					selectedTasks.value = [
						...selectedTasks.value,
						task ?? { id: '', name: taskName, completed: false, plannedHours: 0 },
					];
				}
			} else {
				const tasksToRemove = selectedTasks.value
					.filter((task) => !_selectedTasks.value.includes(task.name))
					.map((task) => task.name);

				selectedTasks.value = selectedTasks.value.filter(
					(task) => !tasksToRemove.includes(task.name)
				);
			}
			const isAllSelected = await isFullySelected(
				_taskOptionsSig.value,
				_selectedTasks.value
			);

			parametersHandler(
				'task',
				isAllSelected ? ['all'] : selectedTasks.value.map((task) => task.name)
			);
		});

		const onChangeCustomer = $(async () => {
			const selectedCustomerNames = selectedCustomers.value.map((cust) => cust.name);
			const customersToAdd = _selectedCustomers.value.filter(
				(customerName) => !selectedCustomerNames.includes(customerName)
			);
			if (customersToAdd.length > 0) {
				for (const customerName of customersToAdd) {
					const customer = await getCustomerSig(customerName);
					selectedCustomers.value = [
						...selectedCustomers.value,
						customer ?? { name: customerName, id: '' },
					];
				}
			} else {
				const customersToRemove = selectedCustomers.value
					.filter((cust) => !_selectedCustomers.value.includes(cust.name))
					.map((cust) => cust.name);
				selectedCustomers.value = selectedCustomers.value.filter(
					(cust) => !customersToRemove.includes(cust.name)
				);
			}

			const isAllSelected = await isFullySelected(
				_customerOptionsSig.value,
				_selectedCustomers.value
			);

			parametersHandler(
				'customer',
				isAllSelected ? ['all'] : selectedCustomers.value.map((cust) => cust.name)
			);
		});

		const onChangeProject = $(async () => {
			const selectedProjectNames = selectedProjects.value.map((proj) => proj.name);
			const projectsToAdd = _selectedProjects.value.filter(
				(projName) => !selectedProjectNames.includes(projName)
			);

			if (projectsToAdd.length > 0) {
				for (const projName of projectsToAdd) {
					const project = await getProjectSig(projName);
					selectedProjects.value = [
						...selectedProjects.value,
						project ?? {
							id: '',
							name: projName,
							type: '',
							plannedHours: 0,
							completed: false,
						},
					];
				}
			} else {
				const projectsToRemove = selectedProjects.value
					.filter((proj) => !_selectedProjects.value.includes(proj.name))
					.map((proj) => proj.name);

				selectedProjects.value = selectedProjects.value.filter(
					(proj) => !projectsToRemove.includes(proj.name)
				);
			}
			const isAllSelected = await isFullySelected(
				_projectOptionsSig.value,
				_selectedProjects.value
			);

			parametersHandler(
				'project',
				isAllSelected ? ['all'] : selectedProjects.value.map((proj) => proj.name)
			);
		});

		const convertToGrouped = useComputed$(() => {
			const teamsMap: Record<string, string[]> = usersSig.value.reduce(
				(map, user) => {
					if (!map[user.crew]) {
						map[user.crew] = [];
					}
					map[user.crew].push(user.name);
					return map;
				},
				{} as Record<string, string[]>
			);

			const teams: GroupedValues[] = Object.keys(teamsMap).map((teamName) => ({
				key: teamName,
				values: teamsMap[teamName],
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
				)?.values;

				if (crewMembers) {
					const allMembersSelected = crewMembers.every((member) =>
						selectedUserNames.has(member)
					);

					if (allMembersSelected) {
						newParams.crew.push(userCrew);
					} else {
						newParams.users.push(user.name);
					}
				}
			}
			const isAllSelected = await isFullySelected(
				usersSig.value.map((user) => user.name),
				_selectedUsers.value
			);
			parametersHandler('crew', isAllSelected ? [] : newParams.crew);
			parametersHandler('users', isAllSelected ? ['all'] : newParams.users);
		});

		const onChangeUser = $(() => {
			selectedUsers.value = _selectedUsers.value.map((user) => {
				const value = usersSig.value.find((element) => element.name === user);
				return (
					value ?? {
						name: user,
						email: '',
						id: '',
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
				optionsSig: Signal<string[]>,
				selectedList: Signal<string[]>
			) => {
				if (!(params[paramKey] && params[paramKey][0] === 'all')) {
					params[paramKey]?.forEach((item) => {
						const matchedItem = optionsSig.value.find(
							(option) => option.toLowerCase() === item.toLowerCase()
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
					.map((user) => user.name);
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
				<Multiselect
					id={UUID() + '-filter-customer'}
					label={t('CUSTOMER_LABEL')}
					placeholder={t('select_empty_label')}
					value={_selectedCustomers}
					options={_customerOptionsSig}
					onChange$={onChangeCustomer}
					allowSelectAll
					size='auto'
				/>

				<Multiselect
					id={UUID() + '-filter-project'}
					label={t('PROJECT_LABEL')}
					placeholder={t('select_empty_label')}
					value={_selectedProjects}
					options={_projectOptionsSig}
					onChange$={onChangeProject}
					allowSelectAll
					size='auto'
				/>

				<Multiselect
					id={UUID() + '-filter-task'}
					label={t('TASK_LABEL')}
					placeholder={t('select_empty_label')}
					value={_selectedTasks}
					options={_taskOptionsSig}
					onChange$={onChangeTask}
					allowSelectAll
					size='auto'
				/>

				<Multiselect
					id={UUID() + '-filter-user'}
					label={t('USER_LABEL')}
					placeholder={t('select_empty_label')}
					value={_selectedUsers}
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
