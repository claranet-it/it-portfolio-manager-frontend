import { $, component$ } from '@builder.io/qwik';
import { t } from 'src/locale/labels';
import { CURRICULUM_VITAE_ROUTE } from 'src/utils/constants';
import { Button } from './Button';
import { NewEducationForm } from './form/NewEducationForm';
import { NewEducationEntryModal } from './modals/NewEducationModal';

export const Education = component$(() => {
	const newEducationCancelAction = $(() => {
		const button = document.getElementById('open-new-education-bt');
		button?.click();
	});

	const schools = [
		{
			id: 0,
			yearStart: 2020,
			yearEnd: 2024,
			title: 'School',
			description: 'Engineering Double Award - Business Studies - English',
		},
		{
			id: 1,
			yearStart: 2020,
			yearEnd: 2024,
			title: 'College Level 2 NVQ',
			description: 'Engineering Science - Physics - Maths',
		},
		{
			id: 2,
			yearStart: 2020,
			yearEnd: 2024,
			title: 'School',
			description: 'Engineering Double Award - Business Studies - English',
		},
		{
			id: 3,
			yearStart: 2022,
			yearEnd: 2023,
			title: 'College Level 2 NVQ',
			description: 'Engineering Science - Physics - Maths',
		},
		{
			id: 4,
			yearStart: 2021,
			yearEnd: 2022,
			title: 'School',
			description: 'Engineering Double Award - Business Studies - English',
		},
		{
			id: 5,
			yearStart: 2020,
			yearEnd: 2021,
			title: 'College Level 2 NVQ',
			description: 'Engineering Science - Physics - Maths',
		},
		{
			id: 6,
			yearStart: 1995,
			yearEnd: 2020,
			title: 'School',
			description: 'Engineering Double Award - Business Studies - English',
		},
		{
			id: 7,
			yearStart: 1990,
			yearEnd: 1995,
			title: 'College Level 2 NVQ',
			description: 'Engineering Science - Physics - Maths',
		},
	];
	return (
		<>
			<span class='text-2xl font-bold text-dark-grey'>{t('EDUCATION_TITLE')}</span>
			<div class='m-0 mt-2 flex w-full items-end space-x-2 sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
				<NewEducationEntryModal q:slot='newEducation'>
					<NewEducationForm onCancel$={newEducationCancelAction} />
				</NewEducationEntryModal>
			</div>
			{schools.map(({ yearEnd, yearStart, title, description, id }) => {
				return (
					<div class='mb-4 border-b border-gray-200 p-2' key={id}>
						<h2 class='text-xs text-darkgray-900'>
							{yearStart} - {yearEnd}
						</h2>
						<h1 class='text-xl font-bold text-darkgray-900'>{title}</h1>
						<h3 class='text-base font-normal text-darkgray-900'>{description}</h3>
					</div>
				);
			})}

			<a
				href={`${window.location.origin}/${CURRICULUM_VITAE_ROUTE.replace(
					':email',
					'maria.teresa.graziano@claranet.com'
				)}`}
				target='_blank'
			>
				<Button>Visualizza CV</Button>
			</a>
		</>
	);
});
