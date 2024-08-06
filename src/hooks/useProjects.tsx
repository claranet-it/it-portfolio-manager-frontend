import { $, Signal, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { getProjects } from 'src/services/projects';

export const useProjects = (customerSig: Signal<Customer>) => {
	const isLoading = useSignal<Boolean>(false);
	const projects = useSignal<Project[]>([]);

	const fetchProjects = $(async () => {
		projects.value = [];
		isLoading.value = true;
		projects.value = await getProjects(undefined, customerSig.value);
		isLoading.value = false;
	});

	useVisibleTask$(({ track }) => {
		track(() => customerSig.value);
		fetchProjects();
	});

	return { projects, isLoading };
};
