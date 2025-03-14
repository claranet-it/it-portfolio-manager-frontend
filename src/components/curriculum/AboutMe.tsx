import { component$ } from '@builder.io/qwik';
import { useAboutMe } from 'src/hooks/curriculum/useAboutMe';
import { t } from 'src/locale/labels';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';
import { AboutMeForm } from './AboutMeForm';

interface Props {
	role?: string;
	summary?: string;
}

export const AboutMe = component$<Props>(({ role, summary }) => {
	const { formModalState, mode, formGroup, openDialog } = useAboutMe(role, summary);

	return (
		<>
			<div class='flex items-center justify-between'>
				<div class='font-bold text-dark-grey'>{t('ABOUT_ME_TITLE')}</div>
				<div>
					<div class='flex w-full flex-row'>
						<button id='open-new-education-bt' onClick$={openDialog} type='button'>
							<div class='content flex flex-row space-x-1 text-clara-red'>
								<span class='content-center text-xl'>
									{mode.value === 'edit' ? getIcon('EditRed') : getIcon('Add')}
								</span>
								<span class='content-center text-base font-bold'>
									{mode.value === 'edit' ? t('ABOUT_ME_EDIT') : t('ABOUT_ME_ADD')}
								</span>
							</div>
						</button>
					</div>
				</div>
			</div>

			<div class='m-0 mt-2 w-full'>
				<div>{role}</div>
				<div class='text-sm'>{summary}</div>
			</div>

			<Modal state={formModalState}>
				<AboutMeForm formGroup={formGroup} />
			</Modal>
		</>
	);
});
