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
import { UUID } from 'src/utils/uuid';

// type Buttons =
// 	| {
// 			type: 'project';
// 			customer: Customer;
// 			label: string;
// 			mainData: Project;
// 	  }
// 	| {
// 			type: 'task';
// 			customer: Customer;
// 			label: string;
// 			mainData: string;
// 			customerIndex: number;
// 			projectIndex: number;
// 	  }
// 	| {
// 			type: 'customer';
// 			label: string;
// 			mainData: Customer;
// 	  };

export const Registry = component$(() => {
	const alertMessageState = useStore<ModalState>({});
	//const editMessageState = useStore<ModalState>({});

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

	// const { data, loading, trackValue, handlers, selected } = useRegistry(
	// 	alertMessageState,
	// 	editMessageState
	// );

	// const buttonList = $((props: Buttons) => {
	// 	const modalStateEdit = useStore<ModalState>({
	// 		title: t('EDIT_TIME_ENTRY'),
	// 		onCancel$: $(() => {}),
	// 		onConfirm$: $(() => {}),
	// 		cancelLabel: t('ACTION_CANCEL'),
	// 		confirmLabel: t('ACTION_CONFIRM'),
	// 	});

	// 	return (
	// 		<div
	// 			class={`${props.type !== 'task' ? 'w-full mr-4' : ''} flex flex-row justify-between items-center`}
	// 		>
	// 			{`${props.label}`}
	// 			<div class='flex flex-row gap-4'>
	// 				{!['customer', 'task'].includes(props.type) && (
	// 					<Button
	// 						variant={'outline'}
	// 						disabled={loading}
	// 						onClick$={(e) => {
	// 							e.stopPropagation();
	// 							if (props.type === 'project') {
	// 								handlers.delete({
	// 									type: 'project',
	// 									customer: props.customer,
	// 									project: props.mainData,
	// 								});
	// 							}
	// 						}}
	// 					>
	// 						{getIcon('Bin')}
	// 					</Button>
	// 				)}
	// 				<Button
	// 					variant={'outline'}
	// 					disabled={loading}
	// 					onClick$={(e) => {
	// 						//modalStateEdit.isVisible = true;
	// 						e.stopPropagation();
	// 						if (props.type === 'project') {
	// 							modalStateEdit.isVisible = true;
	// 							handlers.edit({
	// 								type: 'project',
	// 								customer: props.customer,
	// 								project: props.mainData,
	// 							});
	// 						} else if (props.type === 'task') {
	// 							// handlers.edit({
	// 							// 	type: 'task',
	// 							// 	customer: props.customer,
	// 							// 	project:
	// 							// 		data[props.customerIndex].projects[props.projectIndex]
	// 							// 			.projectName,
	// 							// 	task: props.mainData,
	// 							// });
	// 						} else {
	// 							// handlers.edit({
	// 							// 	type: 'customer',
	// 							// 	customer: props.mainData,
	// 							// });
	// 						}
	// 					}}
	// 				>
	// 					{getIcon('Edit')}
	// 				</Button>
	// 			</div>

	// 			{/* <Modal key={UUID()} state={modalStateEdit}>
	// 				{props.type === 'project' && <p>{props.mainData.name}</p>}
	// 				{props.type === 'customer' && <p>{props.mainData}</p>}
	// 				{props.type === 'task' && <p>{props.mainData}</p>}
	// 			</Modal> */}
	// 		</div>
	// 	);
	// });

	// const taskList = $((customer: Customer, project: Project) => {
	// 	const selectedProjectIndex = selected.getProject.value.findIndex(
	// 		(p) => p.project === project && p.customer === customer
	// 	);

	// 	if (selectedProjectIndex !== -1) {
	// 		const customerIndex = data.findIndex((data) => data.customer === customer);
	// 		const projectIndex = data[customerIndex].projects.findIndex(
	// 			(data) => data.projectName === project
	// 		);
	// 		const tasks = data[customerIndex].projects[projectIndex].tasks;

	// 		return (
	// 			<>
	// 				<div class='flex flex-row justify-between items-center mb-4'>
	// 					<h2 class={'font-semibold'}>{t('REGISTRY_TASKS_LABEL')}</h2>
	// 				</div>
	// 				<Accordion
	// 					nested
	// 					loading={tasks.length === 0}
	// 					cards={tasks.map((task) => ({
	// 						opened: true,
	// 						body: buttonList({
	// 							type: 'task',
	// 							customer,
	// 							label: task,
	// 							projectIndex,
	// 							customerIndex,
	// 							mainData: task,
	// 						}),
	// 						disabled: loading,
	// 					}))}
	// 				/>
	// 			</>
	// 		);
	// 	}
	// });

	// const projectList = $((customer: Customer) => {
	// 	if (selected.getCustomer.value.includes(customer)) {
	// 		const customerIndex = data.findIndex((data) => data.customer === customer);
	// 		const projects = data[customerIndex].projects;

	// 		return (
	// 			<>
	// 				<div class='flex flex-row justify-between items-center mb-4'>
	// 					<h2 class={'font-semibold'}>{t('REGISTRY_PROJECTS_LABEL')}</h2>
	// 				</div>
	// 				<Accordion
	// 					nested
	// 					loading={projects.length === 0}
	// 					cards={projects.map((project) => ({
	// 						title: buttonList({
	// 							type: 'project',
	// 							customer,
	// 							label: project.projectName.name,
	// 							mainData: project.projectName,
	// 						}),
	// 						opened:
	// 							selected.getProject.value.findIndex(
	// 								(p) =>
	// 									p.project === project.projectName && p.customer === customer
	// 							) !== -1,
	// 						onTitleClick: $(() =>
	// 							selected.setProject(customer, project.projectName)
	// 						),
	// 						disabled: loading,
	// 						body: taskList(customer, project.projectName),
	// 					}))}
	// 				/>
	// 			</>
	// 		);
	// 	}
	// });

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
					{/* <Accordion
						cards={data.map((data) => ({
							title: buttonList({
								type: 'customer',
								label: data.customer,
								mainData: data.customer,
							}),
							opened: selected.getCustomer.value.includes(data.customer),
							onTitleClick: $(() => selected.setCustomer(data.customer)),
							body: projectList(data.customer),
							disabled: loading,
						}))}
					/> */}

					<div id='accordion-nested-parent' data-accordion='collapse'>
						{customers.value.map((customer) => (
							<CustomerAccordion customer={customer} />
						))}
					</div>
				</div>
			</div>

			<Modal state={alertMessageState}>
				<p q:slot='modalBody' class='text-base leading-relaxed text-dark-gray'>
					{alertMessageState.message}
				</p>
			</Modal>

			{/* <Modal state={editMessageState}>
				<Input
					styleClass='w-full'
					placeholder={handlers.editValues.prevValue.value}
					bindValue={handlers.editValues.newValue}
				/>
			</Modal> */}
		</>
	);
});

interface CustomerAccordionProps {
	customer: Customer;
}

const CustomerAccordion = component$<CustomerAccordionProps>(({ customer }) => {
	const { projects } = useProjects(useSignal(customer));

	const key = UUID();
	const customerModalState = useStore<ModalState>({
		title: 'Edit customer',
		onCancel$: $(() => {}),
		onConfirm$: $(() => {}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	return (
		<>
			<h2 id={`accordion-collapse-heading-${key}`}>
				<button
					type='button'
					class='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border  border-gray-200  focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800   hover:bg-gray-100  gap-3'
					data-accordion-target={`#accordion-collapse-body-${key}`}
					aria-controls={`accordion-collapse-body-${key}`}
				>
					<span>{customer}</span>

					<Button onClick$={() => (customerModalState.isVisible = true)}>Edit</Button>
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

				<Modal key={key} state={customerModalState}>
					<p>{customer}</p>
				</Modal>
			</h2>
			<div
				id={`accordion-collapse-body-${key}`}
				class='hidden'
				aria-labelledby={`accordion-collapse-heading-${key}`}
			>
				<div class='p-5 border border-gray-200'>
					{/* <!-- Nested accordion --> */}
					{projects.value.map((project) => (
						<ProjectAccordion project={project} />
					))}

					{/* <!-- End: Nested accordion --> */}
				</div>
			</div>
		</>
	);
});

interface ProjectAccordionProps {
	project: Project;
}

const ProjectAccordion = component$<ProjectAccordionProps>(({ project }) => {
	const pUID = UUID();

	const projectModalState = useStore<ModalState>({
		title: 'Edit project',
		onCancel$: $(() => {}),
		onConfirm$: $(() => {}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	return (
		<div id='accordion-nested-collapse' data-accordion='collapse'>
			<h2 id={`#accordion-nested-collapse-heading-${pUID}`}>
				<button
					type='button'
					class='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border  border-gray-200 focus:ring-4 focus:ring-gray-200  hover:bg-gray-100 gap-3'
					data-accordion-target={`#accordion-nested-collapse-body-${pUID}`}
					aria-expanded='false'
					aria-controls={`accordion-nested-collapse-body-${pUID}`}
				>
					<span>{project.name}</span>

					<Button onClick$={() => (projectModalState.isVisible = true)}>Edit</Button>

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
				<Modal key={pUID} state={projectModalState}>
					<p>{project.name}</p>
				</Modal>
			</h2>
			<div
				id={`accordion-nested-collapse-body-${pUID}`}
				class='hidden'
				aria-labelledby={`accordion-nested-collapse-heading-${pUID}`}
			>
				<TaskAccordion task={'TEST'} />
			</div>
		</div>
	);
});

interface TaskAccordionProps {
	task: Task;
}

const TaskAccordion = component$<TaskAccordionProps>(({ task }) => {
	const tUID = UUID();
	return (
		<div key={tUID} class='p-5 border border-gray-200'>
			<span>{task}</span>
		</div>
	);
});
