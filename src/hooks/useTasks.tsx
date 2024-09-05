import { $, useContext, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { AppContext } from 'src/app';
import { editTask, getTasks } from 'src/services/tasks';

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

	const updateTask = $(
		async (customer: Customer, project: Project, task: string, editedTask: string) => {
			appStore.isLoading = true;
			const response = await editTask(customer, project, task, editedTask);
			appStore.isLoading = false;
			return response;
		}
	);

	return { tasks, fetchTasks, isLoading, updateTask };
};
