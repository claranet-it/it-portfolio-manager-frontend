import { $, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { getTasks } from 'src/services/tasks';

export const useTasks = () => {
	const isLoading = useSignal<Boolean>(false);
	const tasks = useSignal<Task[]>([]);

	const fetchTasks = $(async (customer: Customer, project: Project) => {
		tasks.value = [];
		isLoading.value = true;
		tasks.value = await getTasks(undefined, customer, project);
		isLoading.value = false;
	});

	return { tasks, fetchTasks, isLoading };
};
