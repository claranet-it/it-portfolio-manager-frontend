import { $, component$, useTask$ } from '@builder.io/qwik';
import { useMyCurriculum } from 'src/hooks/useMyCurriculum';
import { t } from 'src/locale/labels';
import { CURRICULUM_VITAE_ROUTE } from 'src/utils/constants';
import { Accordion } from '../Accordion';
import { Button } from '../Button';
import { AboutMe } from './AboutMe';
import { Education } from './Education';
import { Skills } from './Skills';
import { Work } from './Work';

export const MyCurriculum = component$(() => {
	const { curriculum, openedMap, fetchMyCurriculum, handleTitleClick } = useMyCurriculum();
	useTask$(async () => {
		await fetchMyCurriculum();
		console.log('####', curriculum.value);
	});

	return (
		<>
			<div class='flex items-center justify-between'>
				<div class='text-2xl font-bold text-dark-grey'>{t('CV_TITLE')}</div>
				<div>
					<a
						href={`${window.location.origin}/${CURRICULUM_VITAE_ROUTE.replace(
							':email',
							'maria.teresa.graziano@claranet.com'
						)}`}
						target='_blank'
					>
						<Button>{t('CV_GENERATE')}</Button>
					</a>
				</div>
			</div>

			<div class='mt-2 w-3/5'>
				<Accordion
					cards={[
						{
							title: 'About me',
							body: (
								<AboutMe
									role={curriculum.value.role}
									summary={curriculum.value.summary}
								/>
							),
							opened: openedMap.ABM,
							onTitleClick: $(() => handleTitleClick('ABM')),
						},
						{
							title: 'Main skills',
							body: <Skills skills={curriculum.value.main_skills} />,
							opened: openedMap.MSK,
							onTitleClick: $(() => handleTitleClick('MSK')),
						},
						{
							title: 'Education',
							body: <Education education={curriculum.value.education} />,
							opened: openedMap.EDU,
							onTitleClick: $(() => handleTitleClick('EDU')),
						},
						{
							title: 'Work experience',
							body: <Work work={curriculum.value.work} />,
							opened: openedMap.WRK,
							onTitleClick: $(() => handleTitleClick('WRK')),
						},
					]}
				></Accordion>
			</div>
		</>
	);
});
