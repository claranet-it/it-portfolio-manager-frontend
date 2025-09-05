import {
	$,
	component$,
	QRL,
	useComputed$,
	useContext,
	useSignal,
	useStore,
	useTask$,
} from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { AppContext } from 'src/app';
import { useNotification } from 'src/hooks/useNotification';
import { useTasks } from 'src/hooks/useTasks';
import { t } from 'src/locale/labels';
import { getCurrentRoute, navigateTo } from 'src/router';
import { limitRoleAccess } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';
import { Badge } from '../Badge';
import { EditTaskForm } from '../form/editTaskFrom';
import { OptionDropdown } from '../form/OptionDropdown';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';

interface TaskAccordionProps {
	customer: Customer;
	project: Project;
	task: Task;
	refresh?: QRL;
}

export const TaskAccordion = component$<TaskAccordionProps>(({ customer, project, task }) => {
	const appStore = useContext(AppContext);
	const { renameTask, updateTask, removeTask } = useTasks();
	const { addEvent } = useNotification();
	const newTaskName = useSignal(task.name);
	const newCompleted = useSignal(task.completed);
	const newPlannedHours = useSignal(task.plannedHours);

	const canAccess = useComputed$(async () => limitRoleAccess(Roles.ADMIN));

	const initFormSignals = $(() => {
		newTaskName.value = task.name;
	});

	const taskDeleteModalState = useStore<ModalState & { idToDelete?: string }>({
		title: t('TASK_DELETE_TITLE'),
		isVisible: false,
		idToDelete: undefined,
		message: t('TASK_DELETE_MESSAGE'),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	useTask$(() => {
		taskDeleteModalState.onCancel$ = $(() => {
			taskDeleteModalState.idToDelete = undefined;
		});

		taskDeleteModalState.onConfirm$ = $(async () => {
			if (taskDeleteModalState.idToDelete) {
				appStore.isLoading = true;
				await removeTask(taskDeleteModalState.idToDelete);
				appStore.isLoading = false;
				taskDeleteModalState.idToDelete = undefined;
			}
		});
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

	const openDeleteDialog = $((id: string) => {
		taskDeleteModalState.idToDelete = id;
		taskDeleteModalState.isVisible = true;
	});

	return (
		<>
			<tr>
				<td class='border border-surface-70 p-3 text-left'>
					<span class='mr-2'>{task.name}</span>
					{task.completed && <Badge label={t('COMPLETED_LABEL')} />}
				</td>
				<td class='w-1/6 border border-surface-70 p-3 text-left'>
					{task.plannedHours !== 0 ? (
						<span class='text-sm'>{task.plannedHours}h</span>
					) : (
						''
					)}
				</td>
				<td class='w-[24px] border border-surface-70 p-3 text-left'>
					{canAccess.value && (
						<div class='flex flex-row gap-3'>
							<OptionDropdown
								id={`options-task-${task.id}`}
								icon={getIcon('V3DotsBlack')}
								label={''}
								options={[
									{
										value: 'Edit task',
										onChange: $(() => (taskModalState.isVisible = true)),
									},
									{
										value: 'Delete task',
										onChange: $(() => openDeleteDialog(task.id)),
										class: 'text-red-500',
									},
								]}
							/>
						</div>
					)}
				</td>
			</tr>

			<Modal state={taskModalState}>
				<EditTaskForm
					name={newTaskName}
					completed={newCompleted}
					plannedHours={newPlannedHours}
				/>
			</Modal>

			<Modal state={taskDeleteModalState}>
				<EditTaskForm
					name={newTaskName}
					completed={newCompleted}
					plannedHours={newPlannedHours}
				/>
			</Modal>
		</>
	);
});
