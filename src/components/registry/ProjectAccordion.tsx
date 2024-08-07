import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { useTasks } from 'src/hooks/useTasks';
import { t } from 'src/locale/labels';
import { Button } from '../Button';
import { LoadingSpinnerInline } from '../LoadingSpinnerInline';
import { Modal } from '../modals/Modal';
import { AccordionOpenButton } from './AccordionOpenButton';
import { TaskAccordion } from './TaskAccordion';

interface ProjectAccordionProps {
	customer: Customer;
	project: Project;
}

export const ProjectAccordion = component$<ProjectAccordionProps>(({ customer, project }) => {
	const visibleBody = useSignal(false);
	const { tasks, fetchTasks, isLoading } = useTasks();

	const projectModalState = useStore<ModalState>({
		title: 'Edit project',
		onCancel$: $(() => {}),
		onConfirm$: $(() => {}),
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
						<span>{project.name}</span> {isLoading.value && <LoadingSpinnerInline />}
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
				<p>{project.name}</p>
			</Modal>
		</>
	);
});
