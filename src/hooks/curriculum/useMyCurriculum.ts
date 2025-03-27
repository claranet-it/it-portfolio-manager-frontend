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
	saveCurriculum,
	updateCurriculum,
	updateEducation,
	updateWork,
} from 'src/services/curriculum';
import { AUTH_USER_KEY, CURRICULUM_VITAE_ROUTE } from 'src/utils/constants';
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

	const goToCurriculum = $(async () => {
		const user = JSON.parse((await get(AUTH_USER_KEY)) || '{}') as UserMe;
		const url = `${window.location.origin}/${CURRICULUM_VITAE_ROUTE.replace(':email', user.email)}`;
		window.open(url, '_blank');
	});

	const fetchMyCurriculum = $(async () => {
		appStore.isLoading = true;
		try {
			curriculum.value = await getCurriculum();
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

	const createCurriculumVitae = $(async (fieldToUpdate: Partial<CurriculumSaveData>) => {
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
	});

	const update = $(async (formGroup: CurriculumUpdateData) => {
		appStore.isLoading = true;
		try {
			if (JSON.stringify(curriculum.value) === '{}') {
				await createCurriculumVitae(formGroup);
			} else {
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
		goToCurriculum,
	};
};
