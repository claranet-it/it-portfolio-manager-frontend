import { $, component$, QRL, useComputed$, useSignal, useStore } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { useNotification } from 'src/hooks/useNotification';
import { useTasks } from 'src/hooks/useTasks';
import { t } from 'src/locale/labels';
import { getCurrentRoute, navigateTo } from 'src/router';
import { limitRoleAccess } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';
import { Button } from '../Button';
import { EditTaskForm } from '../form/editTaskFrom';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';

interface TaskAccordionProps {
	customer: Customer;
	project: Project;
	task: Task;
	refresh?: QRL;
}

export const TaskAccordion = component$<TaskAccordionProps>(({ customer, project, task }) => {
	const { renameTask, updateTask } = useTasks();
	const { addEvent } = useNotification();

	const newTaskName = useSignal(task.name);
	const newCompleted = useSignal(task.completed);
	const newPlannedHours = useSignal(task.plannedHours);

	const canAccess = useComputed$(async () => limitRoleAccess(Roles.ADMIN));

	const initFormSignals = $(() => {
		newTaskName.value = task.name;
	});

	const taskModalState = useStore<ModalState>({
		title: t('TASK_EDIT_TITLE'),
		onCancel$: $(() => {
			initFormSignals();
		}),
		onConfirm$: $(async () => {
			if (newTaskName.value !== task.name) {
				if (await renameTask(customer, project, task, newTaskName.value)) {
					addEvent({
						type: 'success',
						message: t('EDIT_TASK_SUCCESS_MESSAGE'),
						autoclose: true,
					});
				}
			}

			if (
				newCompleted.value !== task.completed ||
				newPlannedHours.value !== task.plannedHours
			) {
				if (
					await updateTask(
						customer,
						project,
						task,
						newCompleted.value,
						newPlannedHours.value
					)
				) {
					addEvent({
						type: 'success',
						message: t('EDIT_TASK_SUCCESS_MESSAGE'),
						autoclose: true,
					});
				}
			}

			if (getCurrentRoute() === 'registry') {
				navigateTo('registry', {
					customer: customer.name,
					project: project.name,
				});
			}
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	return (
		<>
			<div class='flex w-full items-center justify-between gap-3 border border-gray-200 p-5 font-medium text-gray-500 focus:ring-4 focus:ring-gray-200 rtl:text-right'>
				<div class='flex flex-row gap-3'>
					<div class='flex flex-col gap-2'>
						<div class='flex flex-row gap-2'>
							<span>{task.name}</span>{' '}
							{task.completed ? (
								<span class='uppercase text-gray-400'>
									({t('COMPLETED_LABEL')})
								</span>
							) : (
								''
							)}
						</div>
						{task.plannedHours !== 0 ? (
							<span class='text-sm text-gray-400'>({task.plannedHours}h)</span>
						) : (
							''
						)}
					</div>
				</div>
				{canAccess.value && (
					<div class='flex flex-row gap-3'>
						{/* <Button variant={'outline'} onClick$={() => {}}>
								{getIcon('Bin')}
							</Button> */}

						<Button
							variant={'outline'}
							onClick$={() => (taskModalState.isVisible = true)}
						>
							{getIcon('Edit')}
						</Button>
					</div>
				)}
			</div>

			<Modal state={taskModalState}>
				<EditTaskForm
					name={newTaskName}
					completed={newCompleted}
					plannedHours={newPlannedHours}
				/>
			</Modal>
		</>
	);
});
