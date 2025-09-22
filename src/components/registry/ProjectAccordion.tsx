import {
	$,
	component$,
	QRL,
	Signal,
	sync$,
	useComputed$,
	useSignal,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { useNotification } from 'src/hooks/useNotification';
import { useProjects } from 'src/hooks/useProjects';
import { useTasks } from 'src/hooks/useTasks';
import { t, tt } from 'src/locale/labels';
import { getCurrentRoute, navigateTo } from 'src/router';
import { limitRoleAccess } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';
import { Badge } from '../Badge';
import { EditProjectForm } from '../form/editProjectFrom';
import { OptionDropdown } from '../form/OptionDropdown';
import { getIcon } from '../icons';
import { LoadingSpinnerInline } from '../LoadingSpinnerInline';
import { Modal } from '../modals/Modal';
import { AccordionOpenButton } from './AccordionOpenButton';
import { TaskAccordion } from './TaskAccordion';

type ProjectAccordionProps = {
	customer: Customer;
	project: Project;
	refresh?: QRL;
	preSelectedData: Signal<{
		customer?: string;
		project?: string;
	}>;
	preOpenData: Signal<{
		customer?: string;
		project?: string;
		beenOpened?: boolean;
	}>;
	hideCompleted: Signal<boolean>;
};

export const ProjectAccordion = component$<ProjectAccordionProps>(
	({ customer, project, refresh, preSelectedData, preOpenData, hideCompleted }) => {
		const visibleBody = useSignal(false);
		const { addEvent } = useNotification();
		const { tasks, fetchTasks, isLoading } = useTasks(hideCompleted);
		const { updateProject, removeProject } = useProjects(hideCompleted);

		const canAccess = useComputed$(async () => limitRoleAccess(Roles.ADMIN));

		const name = useSignal(project.name);
		const type = useSignal(project.type);
		const completed = useSignal(project.completed);
		const plannedHours = useSignal(project.plannedHours);

		const initFormSignals = $(() => {
			name.value = project.name;
			type.value = project.type;
			completed.value = project.completed;
		});

		const projectModalState = useStore<ModalState>({
			title: t('EDIT_PROJECT'),
			onCancel$: $(() => {
				initFormSignals();
			}),
			onConfirm$: $(async () => {
				const editedProject = {
					id: project.id,
					name: name.value,
					type: type.value,
					plannedHours: Number(plannedHours.value),
					completed: completed.value,
				};
				if (await updateProject(customer, project, editedProject)) {
					addEvent({
						type: 'success',
						message: t('EDIT_PROJECT_SUCCESS_MESSAGE'),
						autoclose: true,
					});
					if (getCurrentRoute() === 'registry') {
						navigateTo('registry', {
							customer: customer.name,
							project: name.value,
						});
					}
				}
			}),
			cancelLabel: t('ACTION_CANCEL'),
			confirmLabel: t('ACTION_CONFIRM'),
		});

		const projectDeleteModalState = useStore<ModalState>({
			title: t('PROEJCT_DELETE_TITLE'),
			message: tt('PROJECT_DELETE_MESSAGE', {
				name: project.name,
			}),
			onConfirm$: $(async () => {
				if (await removeProject(customer, project)) {
					refresh && refresh();
					addEvent({
						type: 'success',
						message: t('DELETE_PROJECT_SUCCESS_MESSAGE'),
						autoclose: true,
					});
				}
			}),
			cancelLabel: t('ACTION_CANCEL'),
			confirmLabel: t('ACTION_CONFIRM'),
		});

		const openBody = sync$(async () => {
			visibleBody.value = !visibleBody.value;
			if (visibleBody.value) await fetchTasks(customer, project);
		});

		const selectPreselected = $(() => {
			preSelectedData.value = {
				customer: customer.name,
				project: project.name,
			};
		});

		useVisibleTask$(async () => {
			if (preOpenData.value.project === project.name && !preOpenData.value.beenOpened) {
				await openBody().then(() => (preOpenData.value.beenOpened = true));
			}
		});

		return (
			<>
				<h2>
					<div
						class={
							'flex w-full items-center justify-between gap-3 border border-gray-200 p-5 font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rtl:text-right ' +
							(visibleBody.value && !isLoading.value
								? 'bg-surface-20'
								: 'bg-surface-5')
						}
					>
						<div class='flex flex-row items-center gap-3'>
							<div>{project.name}</div>
							{project.completed && <Badge label={t('COMPLETED_LABEL')} />}

							{isLoading.value && <LoadingSpinnerInline />}
						</div>

						<div class='flex flex-row items-center gap-3'>
							{project.plannedHours !== 0 && (
								<div class='text-sm text-gray-400'>
									{tt('PLANNED_HOURS', { hours: String(project.plannedHours) })}
								</div>
							)}
							<div>
								{canAccess.value && (
									<OptionDropdown
										id={`options-project-${project.id}`}
										icon={getIcon('V3DotsBlack')}
										label={''}
										options={[
											{
												value: 'Edit project',
												onChange: $(
													() => (projectModalState.isVisible = true)
												),
											},
											{
												value: 'Delete project',
												onChange: $(
													() => (projectDeleteModalState.isVisible = true)
												),
												class: 'text-red-500',
											},
										]}
									/>
								)}
							</div>

							<AccordionOpenButton onClick$={openBody} accordionState={visibleBody} />
						</div>
					</div>
				</h2>

				{/* accordion body */}
				<div class={visibleBody.value && !isLoading.value ? '' : 'hidden'}>
					<div class='border border-b-0 border-gray-200 p-5 dark:border-gray-700'>
						<div class='mb-4 flex items-center sm:flex-col sm:space-y-3 md:flex-row md:justify-between lg:flex-row lg:justify-between'>
							<div>
								<h2 class='text-sm font-bold text-darkgray-900'>
									Total tasks {tasks.value.length}
								</h2>
							</div>
							<div>
								<button
									id='open-new-education-bt'
									onClick$={selectPreselected}
									type='button'
								>
									<div class='content flex flex-row space-x-1 text-clara-red'>
										<span class='content-center text-xl'>{getIcon('Add')}</span>
										<span class='content-center text-base font-bold'>
											{t('add_new_task_label')}
										</span>
									</div>
								</button>
							</div>
						</div>
						{tasks.value.length ? (
							<table class='w-full'>
								<thead>
									<tr class='text-sm font-medium text-gray-700'>
										<th class='flex-1 border-r border-surface-70 bg-surface-20 p-3 text-left'>
											Tasks
										</th>

										<th class='w-1/6 border-r border-surface-70 bg-surface-20 p-3 text-left'>
											Planned hours
										</th>
										<th class='w-[24px] bg-surface-20'></th>
									</tr>
								</thead>
								<tbody>
									{tasks.value
										.sort((taskA, taskB) =>
											taskA.name.localeCompare(taskB.name)
										)
										.map((task) => {
											return (
												<TaskAccordion
													key={`task-${customer.id}-${project.name}-${task.name}`}
													customer={customer}
													project={project}
													task={task}
												/>
											);
										})}
								</tbody>
							</table>
						) : null}
					</div>
				</div>

				<Modal state={projectModalState}>
					<EditProjectForm
						name={name}
						type={type}
						completed={completed}
						plannedHours={plannedHours}
					/>
				</Modal>

				<Modal state={projectDeleteModalState} />
			</>
		);
	}
);
