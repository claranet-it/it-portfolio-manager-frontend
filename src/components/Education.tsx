import { component$ } from '@builder.io/qwik';
import { t } from 'src/locale/labels';
import { NewEducationForm } from './form/NewEducationForm';
import { NewEducationEntryModal } from './modals/NewEducationModal';

export const Education = component$(() => {
	return (
		<>
			<span class='text-2xl font-bold text-dark-grey'>{t('EDUCATION_TITLE')}</span>
			<div class='m-0 mt-2 flex w-full items-end space-x-2 sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
				<NewEducationEntryModal q:slot='newProject'>
					<NewEducationForm />
				</NewEducationEntryModal>
			</div>
		</>
	);
});
