import { $, Signal, useContext, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { AppContext } from 'src/app';
import { deleteProject, editProject, getProjects } from 'src/services/projects';

export const useProjects = (hideCompleted?: Signal<boolean>) => {
	const appStore = useContext(AppContext);

	const isLoading = useSignal<boolean>(false);
	const projects = useSignal<Project[]>([]);

	const fetchProjects = $(async (customer: Customer) => {
		projects.value = [];
		isLoading.value = true;
		projects.value = await getProjects(customer, hideCompleted?.value);
		for (const project of projects.value) {
			console.log('project id: ', project.id, ' project name: ', project.name);
		}
		isLoading.value = false;
	});

	const updateProject = $(
		async (customer: Customer, project: Project, editedProject: Project) => {
			appStore.isLoading = true;
			const response = await editProject(customer, project, editedProject);
			appStore.isLoading = false;
			return response;
		}
	);

	const removeProject = $(async (customer: Customer, project: Project) => {
		appStore.isLoading = true;
		const response = await deleteProject(customer, project);
		appStore.isLoading = false;
		return response;
	});

	return { projects, fetchProjects, isLoading, updateProject, removeProject };
};
