import { $, useContext, useSignal, useStore } from '@builder.io/qwik';
import {
	CurriculumGetResponse,
	CurriculumSaveData,
	CurriculumUpdateData,
	EducationSaveData,
	EducationUpdateData,
	WorkSaveData,
	WorkUpdateData,
} from '@models/curriculumVitae';
import { UserMe } from '@models/user';
import { AppContext } from 'src/app';
import {
	addEducation,
	addWork,
	deleteEducation,
	deleteWork,
	getCurriculum,
	updateCurriculum,
	updateEducation,
	updateWork,
} from 'src/services/curriculum';
import { AUTH_USER_KEY } from 'src/utils/constants';
import { get } from 'src/utils/localStorage/localStorage';
import { useNotification } from '../useNotification';

export const INIT_CV_VALUE = {} as CurriculumGetResponse;

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

	const curriculum = useSignal<CurriculumGetResponse>(INIT_CV_VALUE);

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

	const save = $(async (formGroup: CurriculumSaveData) => {
		appStore.isLoading = true;
		try {
			/* await saveCurriculum(formGroup); */
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

	const createCurriculumVitae = $(async (fieldToUpdate: Partial<CurriculumSaveData>) => {
		console.log('### qui lo creo');
		appStore.isLoading = true;
		const user = JSON.parse((await get(AUTH_USER_KEY)) || '{}') as UserMe;
		const initCV = {
			name: user.name,
			email: user.email,
			role: '',
			summary: '',
			main_skills: '',
			education: [],
			work: [],
		};
		const toSave = { ...initCV, ...fieldToUpdate };
		await save(toSave);
		console.log('##### createCV', JSON.stringify(toSave));
	});

	const update = $(async (formGroup: CurriculumUpdateData) => {
		appStore.isLoading = true;
		try {
			if (JSON.stringify(curriculum.value) === '{}') {
				await createCurriculumVitae(formGroup);
			} else {
				console.log('### qui lo aggiorno', JSON.stringify(formGroup));
				await updateCurriculum(formGroup);
			}
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

	const addNewEducation = $(async (formGroup: EducationSaveData) => {
		appStore.isLoading = true;
		try {
			if (JSON.stringify(curriculum.value) === '{}') {
				await createCurriculumVitae({ education: [formGroup] });
			} else {
				console.log('### qui lo aggiorno', JSON.stringify(formGroup));
				await addEducation(formGroup);
			}
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

	const addNewWork = $(async (formGroup: WorkSaveData) => {
		appStore.isLoading = true;
		try {
			if (JSON.stringify(curriculum.value) === '{}') {
				await createCurriculumVitae({ work: [formGroup] });
			} else {
				console.log('### qui lo aggiorno', JSON.stringify(formGroup));
				await addWork(formGroup);
			}
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

	const updateWorkItem = $(async (id: string, payload: WorkUpdateData) => {
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
		addNewEducation,
		addNewWork,
		updateEducationItem,
		updateWorkItem,
		deleteWorkItem,
		deleteEducationItem,
	};
};
