import { $, useContext, useSignal } from '@builder.io/qwik';
import { CurriculumVitaeData } from '@models/curriculumVitae';
import { UserMe } from '@models/user';
import { AppContext } from 'src/app';
import { findMatchingRoute } from 'src/router';
import { AUTH_USER_KEY } from 'src/utils/constants';
import { validateEmail } from 'src/utils/email';
import { get } from 'src/utils/localStorage/localStorage';

export const useCurriculumVitae = () => {
	const appStore = useContext(AppContext);

	const curriculumVitae = useSignal<CurriculumVitaeData>({} as CurriculumVitaeData);

	const initCurriculumVitae = $(async () => {
		const match = findMatchingRoute();
		if (!match) return;
		const email = match[1].email ?? null;
		if (!email || !validateEmail(email)) return;

		appStore.isLoading = true;

		/* getCurriculumVitaeByEmail(email) */
		const user = JSON.parse((await get(AUTH_USER_KEY)) || '{}') as UserMe;
		const curriculumVitaeData = {
			name: user.name,
			email: user.email,
		};
		curriculumVitae.value = { ...curriculumVitaeData };

		curriculumVitae.value.role = 'Frontend Developer';

		curriculumVitae.value.work = [
			{
				year_start: 2022,
				year_end: 2024,
				institution: 'Project Manager @ Claranet Italia',
				description:
					'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
			},
			{
				year_start: 2020,
				year_end: 2022,
				institution: 'Fullstack developer @ Company S.p.A.',
				description:
					'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
			},
		];

		curriculumVitae.value.intro =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod empor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo	consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
		curriculumVitae.value.education = [
			{
				year_start: 2017,
				year_end: 2020,
				institution: "Master's degree in Project management - 110/110 cum laude",
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			},
			{
				year_start: 2012,
				year_end: 2017,
				institution: "Bachelor's degree in Science - 110/110",
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			},
		];

		curriculumVitae.value.main_skills = ['Angular', 'Jira', 'Agile methodology'];
		appStore.isLoading = false;
	});

	return {
		initCurriculumVitae,
		curriculumVitae,
	};
};
