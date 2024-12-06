import { $, useContext, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { AppContext } from 'src/app';
import { editTask, editTaskName, getTasks } from 'src/services/tasks';

export const useTasks = () => {
	const appStore = useContext(AppContext);
	const isLoading = useSignal<Boolean>(false);
	const tasks = useSignal<Task[]>([]);

	const fetchTasks = $(async (customer: Customer, project: Project) => {
		tasks.value = [];
		isLoading.value = true;
		tasks.value = await getTasks(customer, project);
		isLoading.value = false;
	});

	const renameTask = $(
		async (customer: Customer, project: Project, task: string, editedTask: string) => {
			appStore.isLoading = true;
			const response = await editTaskName(customer, project, task, editedTask);
			appStore.isLoading = false;
			return response;
		}
	);

	const updateTask = $(
		async (
			customer: Customer,
			project: Project,
			task: string,
			completed: boolean,
			plannedHours: number
		) => {
			appStore.isLoading = true;
			const response = await editTask(customer, project, task, completed, plannedHours);
			appStore.isLoading = false;
			return response;
		}
	);

	return { tasks, fetchTasks, isLoading, renameTask, updateTask };
};
