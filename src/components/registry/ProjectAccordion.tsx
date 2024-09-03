import { $, component$, QRL, useSignal, useStore } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { useNotification } from 'src/hooks/useNotification';
import { useProjects } from 'src/hooks/useProjects';
import { useTasks } from 'src/hooks/useTasks';
import { t, tt } from 'src/locale/labels';
import { Button } from '../Button';
import { EditProjectForm } from '../form/editProjectFrom';
import { getIcon } from '../icons';
import { LoadingSpinnerInline } from '../LoadingSpinnerInline';
import { Modal } from '../modals/Modal';
import { AccordionOpenButton } from './AccordionOpenButton';
import { TaskAccordion } from './TaskAccordion';

interface ProjectAccordionProps {
	customer: Customer;
	project: Project;
	refresh?: QRL;
}

export const ProjectAccordion = component$<ProjectAccordionProps>(
	({ customer, project, refresh }) => {
		const visibleBody = useSignal(false);
		const { addEvent } = useNotification();
		const { tasks, fetchTasks, isLoading } = useTasks();
		const { updateProject, removeProject } = useProjects();

		const name = useSignal(project.name);
		const type = useSignal(project.type);
		const plannedHours = useSignal(project.plannedHours);

		const initFormSignals = $(() => {
			name.value = project.name;
			type.value = project.type;
		});

		const projectModalState = useStore<ModalState>({
			title: t('EDIT_PROJECT'),
			onCancel$: $(() => {
				initFormSignals();
			}),
			onConfirm$: $(async () => {
				const editedProject = {
					name: name.value,
					type: type.value,
					plannedHours: plannedHours.value,
				};
				if (await updateProject(customer, project, editedProject)) {
					refresh && refresh();
					addEvent({
						type: 'success',
						message: t('EDIT_PROJECT_SUCCESS_MESSAGE'),
						autoclose: true,
					});
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

		const openBody = $(() => {
			visibleBody.value = !visibleBody.value;
			if (visibleBody.value) fetchTasks(customer, project);
		});

		return (
			<>
				<h2>
					<div class='flex w-full items-center justify-between gap-3 border border-gray-200 p-5 font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rtl:text-right'>
						<div class='flex flex-row gap-3'>
							<span>{project.name}</span>{' '}
							{isLoading.value && <LoadingSpinnerInline />}
						</div>

						<div class='flex flex-row gap-3'>
							<Button
								variant={'outline'}
								onClick$={() => (projectDeleteModalState.isVisible = true)}
							>
								{getIcon('Bin')}
							</Button>

							<Button
								variant={'outline'}
								onClick$={() => (projectModalState.isVisible = true)}
							>
								{getIcon('Edit')}
							</Button>

							<AccordionOpenButton onClick$={openBody} accordionState={visibleBody} />
						</div>
					</div>
				</h2>

				{/* accordion body */}
				<div class={visibleBody.value && !isLoading.value ? '' : 'hidden'}>
					<div class='border border-b-0 border-gray-200 p-5 dark:border-gray-700'>
						{tasks.value.map((task) => {
							return (
								<TaskAccordion customer={customer} project={project} task={task} />
							);
						})}
					</div>
				</div>

				<Modal state={projectModalState}>
					<EditProjectForm name={name} type={type} plannedHours={plannedHours} />
				</Modal>

				<Modal state={projectDeleteModalState} />
			</>
		);
	}
);
