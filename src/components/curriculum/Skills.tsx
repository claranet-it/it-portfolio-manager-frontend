import { component$, QRL } from '@builder.io/qwik';
import { useSkills } from 'src/hooks/curriculum/useSkills';
import { t } from 'src/locale/labels';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';
import { SkillsForm } from './SkillsForm';

interface Props {
	skills?: string;
	onUpdate: QRL;
	onCreate: QRL;
}

export const Skills = component$<Props>(({ skills, onUpdate, onCreate }) => {
	const { formModalState, mode, formGroup, openDialog } = useSkills(skills, onUpdate, onCreate);

	return (
		<>
			<div class='flex items-center justify-between'>
				<div class='font-bold text-dark-grey'>{t('SKILLS_TITLE')}</div>
				<div>
					<div class='flex w-full flex-row'>
						<button id='open-new-education-bt' onClick$={openDialog} type='button'>
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

			<Modal state={formModalState}>
				<SkillsForm formGroup={formGroup} />
			</Modal>
		</>
	);
});
