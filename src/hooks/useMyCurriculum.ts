import { $, useContext, useSignal, useStore } from '@builder.io/qwik';
import { CurriculumVitaeData } from '@models/curriculumVitae';
import { AppContext } from 'src/app';
import { useNotification } from './useNotification';

export const INIT_CV_VALUE = {} as CurriculumVitaeData;

export const useMyCurriculum = () => {
	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const openedMap = useStore({
		ABM: true,
		MSK: true,
		EDU: true,
		WRK: true,
	});

	const handleTitleClick = $((field: 'ABM' | 'MSK' | 'EDU' | 'WRK'): void => {
		openedMap[field] = !openedMap[field];
	});

	const curriculum = useSignal<CurriculumVitaeData>(INIT_CV_VALUE);

	const fetchMyCurriculum = $(async () => {
		appStore.isLoading = true;
		try {
			/* curriculum.value = await getCurriculum(); */
			curriculum.value = {
				name: 'Maria Teresa Graziano',
				email: 'maria.teresa.graziano@claranet.com',
				role: 'Frontend Developer',
				summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				main_skills: 'Agile, Management, jira',
				education: [
					{
						note: "Master's degree",
						institution: 'University',
						year_start: 2015,
						year_end: 2020,
						current: false,
					},
				],
				work: [
					{
						note: 'R&D',
						role: 'developer',
						institution: 'Company',
						year_start: 2020,
						year_end: 2025,
						current: false,
					},
					{
						note: 'Ricercatore',
						role: 'stage',
						institution: 'Company X',
						year_start: 2017,
						year_end: 2020,
						current: false,
					},
				],
			};
			if (JSON.stringify(curriculum.value) === '{}') {
				console.log('### non ancora costruito a BE');
			}
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
		curriculum,
		openedMap,
		fetchMyCurriculum,
		handleTitleClick,
	};
};
