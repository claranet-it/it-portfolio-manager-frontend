import { $, component$, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { Task } from '@models/task';
import { t } from 'src/locale/labels';
import { Button } from '../Button';
import { Modal } from '../modals/Modal';

interface TaskAccordionProps {
	task: Task;
}

export const TaskAccordion = component$<TaskAccordionProps>(({ task }) => {
	const taskModalState = useStore<ModalState>({
		title: 'Edit task',
		onCancel$: $(() => {}),
		onConfirm$: $(() => {}),
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
					<Button variant={'outline'} onClick$={() => {}}>
						{t('ACTION_DELETE')}
					</Button>

					<Button variant={'outline'} onClick$={() => (taskModalState.isVisible = true)}>
						{t('edit')}
					</Button>
				</div>
			</div>

			<Modal state={taskModalState}>
				<p>{task}</p>
			</Modal>
		</>
	);
});
