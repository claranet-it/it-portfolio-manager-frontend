import { $, useContext, useSignal, useStore } from '@builder.io/qwik';
import {
	CurriculumVitaeData,
	EducationData,
	EducationUpdateData,
	UpdateCurriculumData,
	WorkData,
} from '@models/curriculumVitae';
import { AppContext } from 'src/app';
import {
	addEducation,
	addWork,
	deleteEducation,
	deleteWork,
	getCurriculum,
	saveCurriculum,
	updateCurriculum,
	updateEducation,
	updateWork,
} from 'src/services/curriculum';
import { useNotification } from '../useNotification';

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
			curriculum.value = await getCurriculum();
			curriculum.value = {
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

	const update = $(async (formGroup: UpdateCurriculumData) => {
		appStore.isLoading = true;
		try {
			await updateCurriculum(formGroup);
			fetchMyCurriculum();
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

	const save = $(async (formGroup: CurriculumVitaeData) => {
		appStore.isLoading = true;
		try {
			await saveCurriculum(formGroup);
			fetchMyCurriculum();
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

	const newEducation = $(async (formGroup: EducationData) => {
		appStore.isLoading = true;
		try {
			await addEducation(formGroup);
			await fetchMyCurriculum();
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

	const newWork = $(async (formGroup: WorkData) => {
		appStore.isLoading = true;
		try {
			await addWork(formGroup);
			await fetchMyCurriculum();
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

	const deleteWorkItem = $(async (id: string) => {
		appStore.isLoading = true;
		try {
			await deleteWork(id);
			await fetchMyCurriculum();
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

	const deleteEducationItem = $(async (id: string) => {
		appStore.isLoading = true;
		try {
			await deleteEducation(id);
			await fetchMyCurriculum();
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

	const updateEducationItem = $(async (id: string, payload: EducationUpdateData) => {
		appStore.isLoading = true;
		try {
			await updateEducation(id, payload);
			await fetchMyCurriculum();
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

	const updateWorkItem = $(async (id: string, payload: EducationUpdateData) => {
		appStore.isLoading = true;
		try {
			await updateWork(id, payload);
			await fetchMyCurriculum();
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
		update,
		save,
		newEducation,
		newWork,
		updateEducationItem,
		updateWorkItem,
		deleteWorkItem,
		deleteEducationItem,
	};
};
