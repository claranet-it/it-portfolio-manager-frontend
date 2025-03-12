import { $, component$, useComputed$, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { t } from 'src/locale/labels';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';
import { SkillsForm } from './SkillsForm';

interface Props {
	skills?: string;
}

export const Skills = component$<Props>(({ skills }) => {
	const mode = useComputed$(() => {
		return skills ? 'edit' : 'new';
	});

	const newFormModalState = useStore<ModalState>({
		title: mode.value === 'edit' ? t('SKILLS_EDIT') : t('SKILLS_ADD'),
		onCancel$: $(() => {}),
		onConfirm$: $(() => {}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
	});

	return (
		<>
			<div class='flex items-center justify-between'>
				<div class='font-bold text-dark-grey'>{t('SKILLS_TITLE')}</div>
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
								<span class='content-center text-xl'>
									{mode.value === 'edit' ? getIcon('EditRed') : getIcon('Add')}
								</span>
								<span class='content-center text-base font-bold'>
									{mode.value === 'edit' ? t('SKILLS_EDIT') : t('SKILLS_ADD')}
								</span>
							</div>
						</button>
					</div>
				</div>
			</div>

			<div class='m-0 mt-2 w-full'>{skills}</div>

			<Modal state={newFormModalState}>
				<SkillsForm />
			</Modal>
		</>
	);
});
