import { $, component$, Signal, useStore } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { TimeEntry } from '@models/timeEntry';
import { Accordion } from 'src/components/Accordion';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/form/Input';
import { NewProjectForm } from 'src/components/form/NewProjectForm';
import { getIcon } from 'src/components/icons';
import { Modal } from 'src/components/modals/Modal';
import { NewProjectModal } from 'src/components/modals/newProjectModal';
import { useRegistry } from 'src/hooks/useRegistry';
import { t } from 'src/locale/labels';

type Buttons =
	| {
			type: 'project';
			customer: Customer;
			mainData: Project;
	  }
	| {
			type: 'task';
			customer: Customer;
			mainData: string;
			customerIndex: number;
			projectIndex: number;
	  }
	| {
			type: 'customer';
			mainData: Customer;
	  };

export const Registry = component$(() => {
	const alertMessageState = useStore<ModalState>({});
	const editMessageState = useStore<ModalState>({});

	const newProjectCancelAction = $(() => {
		const button = document.getElementById('open-new-project-bt');
		button?.click();
	});

	const { data, loading, trackValue, handlers, selected } = useRegistry(
		alertMessageState,
		editMessageState
	);

	const buttonList = $((props: Buttons) => {
		return (
			<div
				class={`${props.type !== 'task' ? 'w-full mr-4' : ''} flex flex-row justify-between items-center`}
			>
				{props.mainData}{' '}
				<div class='flex flex-row gap-4'>
					{!['customer', 'task'].includes(props.type) && (
						<Button
							variant={'outline'}
							disabled={loading}
							onClick$={(e) => {
								e.stopPropagation();
								if (props.type === 'project') {
									handlers.delete({
										type: 'project',
										customer: props.customer,
										project: props.mainData,
									});
								}
							}}
						>
							{getIcon('Bin')}
						</Button>
					)}
					<Button
						variant={'outline'}
						disabled={loading}
						onClick$={(e) => {
							e.stopPropagation();
							if (props.type === 'project') {
								handlers.edit({
									type: 'project',
									customer: props.customer,
									project: props.mainData,
								});
							} else if (props.type === 'task') {
								handlers.edit({
									type: 'task',
									customer: props.customer,
									project:
										data[props.customerIndex].projects[props.projectIndex]
											.projectName,
									task: props.mainData,
								});
							} else {
								handlers.edit({
									type: 'customer',
									customer: props.mainData,
								});
							}
						}}
					>
						{getIcon('Edit')}
					</Button>
				</div>
			</div>
		);
	});

	const taskList = $((customer: Customer, project: Project) => {
		const selectedProjectIndex = selected.getProject.value.findIndex(
			(p) => p.project === project && p.customer === customer
		);

		if (selectedProjectIndex !== -1) {
			const customerIndex = data.findIndex((data) => data.customer === customer);
			const projectIndex = data[customerIndex].projects.findIndex(
				(data) => data.projectName === project
			);
			const tasks = data[customerIndex].projects[projectIndex].tasks;

			return (
				<>
					<div class='flex flex-row justify-between items-center mb-4'>
						<h2 class={'font-semibold'}>{t('REGISTRY_TASKS_LABEL')}</h2>
					</div>
					<Accordion
						nested
						loading={tasks.length === 0}
						cards={tasks.map((task) => ({
							opened: true,
							body: buttonList({
								type: 'task',
								customer,
								projectIndex,
								customerIndex,
								mainData: task,
							}),
							disabled: loading,
						}))}
					/>
				</>
			);
		}
	});

	const projectList = $((customer: Customer) => {
		if (selected.getCustomer.value.includes(customer)) {
			const customerIndex = data.findIndex((data) => data.customer === customer);
			const projects = data[customerIndex].projects;

			return (
				<>
					<div class='flex flex-row justify-between items-center mb-4'>
						<h2 class={'font-semibold'}>{t('REGISTRY_PROJECTS_LABEL')}</h2>
					</div>
					<Accordion
						nested
						loading={projects.length === 0}
						cards={projects.map((project) => ({
							title: buttonList({
								type: 'project',
								customer,
								mainData: project.projectName,
							}),
							opened:
								selected.getProject.value.findIndex(
									(p) =>
										p.project === project.projectName && p.customer === customer
								) !== -1,
							onTitleClick: $(() =>
								selected.setProject(customer, project.projectName)
							),
							disabled: loading,
							body: taskList(customer, project.projectName),
						}))}
					/>
				</>
			);
		}
	});

	return (
		<>
			<div class='w-full px-6 pt-2.5 space-y-3 mb-32'>
				<div class='flex sm:flex-col md:flex-row lg:flex-row  sm:space-y-3 md:justify-between lg:justify-between'>
					<h1 class='text-2xl font-bold text-darkgray-900 me-4'>
						{t('REGISTRY_PAGE_TITLE')}
					</h1>
					<NewProjectModal q:slot='newProject'>
						<NewProjectForm
							timeEntry={trackValue as Signal<TimeEntry>}
							alertMessageState={alertMessageState}
							onCancel$={newProjectCancelAction}
							allowNewEntry={true}
						/>
					</NewProjectModal>
				</div>
				<div class={`${loading ? 'animate-pulse' : ''}`}>
					<Accordion
						cards={data.map((data) => ({
							title: buttonList({
								type: 'customer',
								mainData: data.customer,
							}),
							opened: selected.getCustomer.value.includes(data.customer),
							onTitleClick: $(() => selected.setCustomer(data.customer)),
							body: projectList(data.customer),
							disabled: loading,
						}))}
					/>
				</div>
			</div>

			<Modal state={alertMessageState}>
				<p q:slot='modalBody' class='text-base leading-relaxed text-dark-gray'>
					{alertMessageState.message}
				</p>
			</Modal>

			<Modal state={editMessageState}>
				<div q:slot='modalBody'>
					<Input
						styleClass='w-full'
						placeholder={handlers.editValues.prevValue.value}
						bindValue={handlers.editValues.newValue}
					/>
				</div>
			</Modal>
		</>
	);
});
