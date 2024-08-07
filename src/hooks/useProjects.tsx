import { $, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { getProjects } from 'src/services/projects';

export const useProjects = () => {
	const isLoading = useSignal<Boolean>(false);
	const projects = useSignal<Project[]>([]);

	const fetchProjects = $(async (customer: Customer) => {
		projects.value = [];
		isLoading.value = true;
		projects.value = await getProjects(undefined, customer);
		isLoading.value = false;
	});

	return { projects, fetchProjects, isLoading };
};
