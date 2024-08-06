import { $, component$, useComputed$, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { TimeEntry } from '@models/timeEntry';
import { Button } from 'src/components/Button';
import { NewProjectForm } from 'src/components/form/NewProjectForm';
import { Modal } from 'src/components/modals/Modal';
import { NewProjectOverlayModal } from 'src/components/modals/newProjectOverlayModal';
import { useCustomers } from 'src/hooks/useCustomers';
import { useProjects } from 'src/hooks/useProjects';
import { t } from 'src/locale/labels';

export const Registry = component$(() => {
	const alertMessageState = useStore<ModalState>({});

	const { customers, isLoading: customerLoading, fetchCustomers } = useCustomers();

	const newProjectCancelAction = $(() => {
		const button = document.getElementById('open-new-project-bt');
		button?.click();
	});

	const update = useSignal<TimeEntry>();

	const generalLoading = useComputed$(() => {
		return customerLoading.value;
	});

	useTask$(async ({ track }) => {
		track(() => update.value);
		await fetchCustomers();
	});

	return (
		<>
			<div class='w-full px-6 pt-2.5 space-y-3 mb-32'>
				<div class='flex sm:flex-col md:flex-row lg:flex-row  sm:space-y-3 md:justify-between lg:justify-between'>
					<h1 class='text-2xl font-bold text-darkgray-900 me-4'>
						{t('REGISTRY_PAGE_TITLE')}
					</h1>
					<NewProjectOverlayModal q:slot='newProject'>
						<NewProjectForm
							timeEntry={update}
							alertMessageState={alertMessageState}
							onCancel$={newProjectCancelAction}
							allowNewEntry={true}
						/>
					</NewProjectOverlayModal>
				</div>
				<div class={`${generalLoading.value ? 'animate-pulse' : ''}`}>
					<div id='accordion-nested-parent' data-accordion='collapse'>
						{customers.value.map((customer) => {
							return <CustomerAccordion customer={customer} />;
						})}
					</div>
				</div>
			</div>

			<Modal state={alertMessageState}>
				<p q:slot='modalBody' class='text-base leading-relaxed text-dark-gray'>
					{alertMessageState.message}
				</p>
			</Modal>
		</>
	);
});

interface CustomerAccordionProps {
	customer: Customer;
}

const CustomerAccordion = component$<CustomerAccordionProps>(({ customer }) => {
	const { projects } = useProjects(useSignal(customer));
	const visibleBody = useSignal(false);

	const customerModalState = useStore<ModalState>({
		title: 'Edit customer',
		onCancel$: $(() => {}),
		onConfirm$: $(() => {}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	return (
		<>
			<h2>
				<button
					type='button'
					class='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border-gray-200 rfocus:ring-4 focus:ring-gray-200   hover:bg-gray-100 gap-3'
					onClick$={() => (visibleBody.value = !visibleBody.value)}
				>
					<span>{customer}</span>

					<Button
						style={'outline'}
						onClick$={() => (customerModalState.isVisible = true)}
					>
						Edit
					</Button>
					<svg
						data-accordion-icon
						class='w-3 h-3 rotate-180 shrink-0'
						aria-hidden='true'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 10 6'
					>
						<path
							stroke='currentColor'
							stroke-linecap='round'
							stroke-linejoin='round'
							stroke-width='2'
							d='M9 5 5 1 1 5'
						/>
					</svg>
				</button>
			</h2>

			{/* accordion body */}
			<div class={visibleBody.value ? '' : 'hidden'}>
				<div class='p-5 border border-gray-200'>
					<div id='accordion-nested-collapse' data-accordion='collapse'>
						{projects.value.map((project) => {
							return <ProjectAccordion project={project} />;
						})}
					</div>
				</div>
			</div>

			<Modal state={customerModalState}>
				<p>{customer}</p>
			</Modal>
		</>
	);
});

interface ProjectAccordionProps {
	project: Project;
}

const ProjectAccordion = component$<ProjectAccordionProps>(({ project }) => {
	const visibleBody = useSignal(false);

	const projectModalState = useStore<ModalState>({
		title: 'Edit project',
		onCancel$: $(() => {}),
		onConfirm$: $(() => {}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	return (
		<>
			<h2>
				<button
					type='button'
					class='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 gap-3'
					onClick$={() => (visibleBody.value = !visibleBody.value)}
				>
					<span>{project.name}</span>

					<Button style={'outline'} onClick$={() => (projectModalState.isVisible = true)}>
						Edit
					</Button>

					<svg
						data-accordion-icon
						class='w-3 h-3 rotate-180 shrink-0'
						aria-hidden='true'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 10 6'
					>
						<path
							stroke='currentColor'
							stroke-linecap='round'
							stroke-linejoin='round'
							stroke-width='2'
							d='M9 5 5 1 1 5'
						/>
					</svg>
				</button>
			</h2>

			{/* accordion body */}
			<div class={visibleBody.value ? '' : 'hidden'}>
				<div class='p-5 border border-b-0 border-gray-200 dark:border-gray-700'>
					{[1, 2, 3].map((task) => {
						return <TaskAccordion task='TASK' />;
					})}
				</div>
			</div>

			<Modal state={projectModalState}>
				<p>{project.name}</p>
			</Modal>
		</>
	);
});

interface TaskAccordionProps {
	task: Task;
}

const TaskAccordion = component$<TaskAccordionProps>(({ task }) => {
	const taskModalState = useStore<ModalState>({
		title: 'Edit task',
		onCancel$: $(() => {}),
		onConfirm$: $(() => {}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	return (
		<>
			<button
				type='button'
				class='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 gap-3'
			>
				<span>{task}</span>

				<Button style={'outline'} onClick$={() => (taskModalState.isVisible = true)}>
					Edit
				</Button>
			</button>

			<Modal state={taskModalState}>
				<p>{task}</p>
			</Modal>
		</>
	);
});
