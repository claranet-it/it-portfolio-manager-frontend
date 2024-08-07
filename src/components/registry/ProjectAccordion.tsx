import { $, component$, QRL, useSignal, useStore } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { useNotification } from 'src/hooks/useNotification';
import { useProjects } from 'src/hooks/useProjects';
import { useTasks } from 'src/hooks/useTasks';
import { t } from 'src/locale/labels';
import { Button } from '../Button';
import { EditProjectForm } from '../form/editProjectFrom';
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
		const { updateProject } = useProjects();

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

		const openBody = $(() => {
			visibleBody.value = !visibleBody.value;
			if (visibleBody.value) fetchTasks(customer, project);
		});

		return (
			<>
				<h2>
					<div class='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 hover:bg-gray-100 gap-3'>
						<div class='flex flex-row gap-3'>
							<span>{project.name}</span>{' '}
							{isLoading.value && <LoadingSpinnerInline />}
						</div>

						<div class='flex flex-row gap-3'>
							<Button variant={'outline'} onClick$={() => {}}>
								{t('ACTION_DELETE')}
							</Button>

							<Button
								variant={'outline'}
								onClick$={() => (projectModalState.isVisible = true)}
							>
								{t('edit')}
							</Button>

							<AccordionOpenButton onClick$={openBody} accordionState={visibleBody} />
						</div>
					</div>
				</h2>

				{/* accordion body */}
				<div class={visibleBody.value && !isLoading.value ? '' : 'hidden'}>
					<div class='p-5 border border-b-0 border-gray-200 dark:border-gray-700'>
						{tasks.value.map((task) => {
							return <TaskAccordion task={task} />;
						})}
					</div>
				</div>

				<Modal state={projectModalState}>
					<EditProjectForm name={name} type={type} plannedHours={plannedHours} />
				</Modal>
			</>
		);
	}
);
