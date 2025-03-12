import { $, component$, useStore } from '@builder.io/qwik';
import { Work as WorkType } from '@models/curriculumVitae';
import { ModalState } from '@models/modalState';
import { t } from 'src/locale/labels';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';
import { WorkForm } from './WorkForm';

interface Props {
	work?: WorkType[];
}
export const Work = component$<Props>(({ work }) => {
	const newFormModalState = useStore<ModalState>({
		title: t('WORK_ADD'),
		onCancel$: $(() => {}),
		onConfirm$: $(() => {}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
	});

	return (
		<>
			<div class='flex items-center justify-between'>
				<div class='font-bold text-dark-grey'>{t('WORK_TITLE')}</div>
				<div>
					<div class='flex w-full flex-row'>
						<button
							id='open-new-education-bt'
							onClick$={() => {
								newFormModalState.isVisible = true;
							}}
							type='button'
						>
							<div class='content flex flex-row space-x-1 text-clara-red'>
								<span class='content-center text-xl'>{getIcon('Add')}</span>
								<span class='content-center text-base font-bold'>
									{t('WORK_ADD')}
								</span>
							</div>
						</button>
					</div>
				</div>
			</div>
			<div class='m-0 mt-2 w-full'>
				{work?.map(({ year_end, year_start, role, note, institution, id }) => {
					return (
						<div class='mb-4 border-b border-gray-200 p-2 pl-0' key={id}>
							<h2 class='text-xs text-darkgray-900'>
								{year_start} - {year_end}
							</h2>
							<h1 class='text-xl font-bold text-darkgray-900'>{institution}</h1>
							<h3 class='text-base font-normal text-darkgray-900'>{role}</h3>
							<h3 class='text-base font-normal text-darkgray-900'>{note}</h3>
						</div>
					);
				})}
			</div>

			<Modal state={newFormModalState}>
				<WorkForm />
			</Modal>
		</>
	);
});
