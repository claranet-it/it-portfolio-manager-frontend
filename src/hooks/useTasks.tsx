import { $, Signal, useContext, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { AppContext } from 'src/app';
import { editTask, editTaskName, getTasks } from 'src/services/tasks';

export const useTasks = (hideCompleted?: Signal<boolean>) => {
	const appStore = useContext(AppContext);
	const isLoading = useSignal<boolean>(false);
	const tasks = useSignal<Task[]>([]);

	const fetchTasks = $(async (customer: Customer, project: Project) => {
		tasks.value = [];
		isLoading.value = true;
		tasks.value = await getTasks(customer, project, hideCompleted?.value);
		isLoading.value = false;
	});

	const renameTask = $(
		async (customer: Customer, project: Project, task: Task, editedTask: string) => {
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
			task: Task,
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
