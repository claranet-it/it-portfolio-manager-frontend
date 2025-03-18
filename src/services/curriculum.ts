import {
	CurriculumVitaeData,
	EducationData,
	EducationUpdateData,
	UpdateCurriculumData,
	WorkData,
	WorkUpdateData,
} from '@models/curriculumVitae';
import { checkHttpResponseStatus, getHttpResponse } from 'src/network/httpRequest';

export const getCurriculum = async (): Promise<CurriculumVitaeData> =>
	getHttpResponse<CurriculumVitaeData>('curriculum');

export const getCurriculumByEmail = async (email: string): Promise<CurriculumVitaeData> =>
	getHttpResponse<CurriculumVitaeData>(`curriculum/${email}`);

export const saveCurriculum = async (payload: CurriculumVitaeData): Promise<boolean> =>
	checkHttpResponseStatus('curriculum', 201, 'POST', payload);

export const updateCurriculum = async (payload: UpdateCurriculumData): Promise<boolean> =>
	checkHttpResponseStatus('curriculum', 204, 'PATCH', payload);

export const addEducation = async (payload: EducationData): Promise<boolean> =>
	checkHttpResponseStatus('education', 201, 'POST', payload);

export const addWork = async (payload: WorkData): Promise<boolean> =>
	checkHttpResponseStatus('work', 201, 'POST', payload);

export const deleteWork = async (id: string): Promise<boolean> =>
	checkHttpResponseStatus(`work/${id}`, 204, 'DELETE');

export const deleteEducation = async (id: string): Promise<boolean> =>
	checkHttpResponseStatus(`education/${id}`, 204, 'DELETE');

export const updateEducation = async (id: string, payload: EducationUpdateData): Promise<boolean> =>
	checkHttpResponseStatus(`education/${id}`, 204, 'PATCH', payload);

export const updateWork = async (id: string, payload: WorkUpdateData): Promise<boolean> =>
	checkHttpResponseStatus(`work/${id}`, 204, 'PATCH', payload);
