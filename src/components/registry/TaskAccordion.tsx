import { $, component$, QRL, useSignal, useStore } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { useNotification } from 'src/hooks/useNotification';
import { useTasks } from 'src/hooks/useTasks';
import { t } from 'src/locale/labels';
import { Button } from '../Button';
import { EditTaskForm } from '../form/editTaskFrom';
import { Modal } from '../modals/Modal';

interface TaskAccordionProps {
	customer: Customer;
	project: Project;
	task: Task;
	refresh?: QRL;
}

export const TaskAccordion = component$<TaskAccordionProps>(
	({ customer, project, task, refresh }) => {
		const { updateTask } = useTasks();
		const { addEvent } = useNotification();
		const name = useSignal(task);

		const initFormSignals = $(() => {
			name.value = task;
		});

		const taskModalState = useStore<ModalState>({
			title: t('TASK_EDIT_TITLE'),
			onCancel$: $(() => {
				initFormSignals();
			}),
			onConfirm$: $(async () => {
				if (await updateTask(customer, project, task, name.value)) {
					refresh && refresh();
					addEvent({
						type: 'success',
						message: t('EDIT_TASK_SUCCESS_MESSAGE'),
						autoclose: true,
					});
				}
			}),
			cancelLabel: t('ACTION_CANCEL'),
			confirmLabel: t('ACTION_CONFIRM'),
		});

		return (
			<>
				<div class='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 gap-3'>
					<div class='flex flex-row gap-3'>
						<span>{task}</span>
					</div>
					<div class='flex flex-row gap-3'>
						{/* <Button variant={'outline'} onClick$={() => {}}>
						{t('ACTION_DELETE')}
					</Button> */}

						<Button
							variant={'outline'}
							onClick$={() => (taskModalState.isVisible = true)}
						>
							{t('edit')}
						</Button>
					</div>
				</div>

				<Modal state={taskModalState}>
					<EditTaskForm name={name} />
				</Modal>
			</>
		);
	}
);
