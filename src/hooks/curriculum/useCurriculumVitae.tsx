import { $, useContext, useSignal } from '@builder.io/qwik';
import { CurriculumVitaeData } from '@models/curriculumVitae';
import { AppContext } from 'src/app';
import { findMatchingRoute } from 'src/router';
import { getCurriculumByEmail } from 'src/services/curriculum';
import { validateEmail } from 'src/utils/email';
import { useNotification } from '../useNotification';

export const useCurriculumVitae = () => {
	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const curriculumVitae = useSignal<CurriculumVitaeData>({} as CurriculumVitaeData);

	const initCurriculumVitae = $(async () => {
		appStore.isLoading = true;
		const match = findMatchingRoute();
		if (!match) return;
		const email = match[1].email ?? null;
		if (!email || !validateEmail(email)) return;

		try {
			curriculumVitae.value = await getCurriculumByEmail(email);
			/* curriculumVitae.value = {
				name: 'Maria Teresa Graziano',
				email: 'maria.teresa.graziano@claranet.com',
				role: 'Frontend Developer',
				summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				main_skills: 'Agile, Management, jira',
				education: [
					{
						id: '1',
						note: "Master's degree",
						institution: 'University',
						year_start: 2015,
						year_end: 2020,
						current: false,
					},
				],
				work: [
					{
						id: '2',
						note: 'R&D',
						role: 'developer',
						institution: 'Company',
						year_start: 2020,
						year_end: 2025,
						current: false,
					},
					{
						id: '3',
						note: 'Ricercatore',
						role: 'stage',
						institution: 'Company X',
						year_start: 2017,
						year_end: 2020,
						current: false,
					},
				],
			}; */
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}

		appStore.isLoading = false;
	});

	return {
		initCurriculumVitae,
		curriculumVitae,
	};
};
