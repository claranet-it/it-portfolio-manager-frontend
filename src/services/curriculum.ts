import {
	CurriculumGetResponse,
	CurriculumSaveData,
	CurriculumUpdateData,
	EducationSaveData,
	EducationUpdateData,
	WorkSaveData,
	WorkUpdateData,
} from '@models/curriculumVitae';
import { checkHttpResponseStatus, getHttpResponse } from 'src/network/httpRequest';

export const getCurriculum = async (): Promise<CurriculumGetResponse> =>
	getHttpResponse<CurriculumGetResponse>('curriculum');

export const getCurriculumByEmail = async (email: string): Promise<CurriculumGetResponse> =>
	getHttpResponse<CurriculumGetResponse>(`curriculum/${email}`);

export const saveCurriculum = async (payload: CurriculumSaveData): Promise<boolean> =>
	checkHttpResponseStatus('curriculum', 201, 'POST', payload);

export const updateCurriculum = async (payload: CurriculumUpdateData): Promise<boolean> =>
	checkHttpResponseStatus('curriculum', 204, 'PATCH', payload);

export const addEducation = async (payload: EducationSaveData): Promise<boolean> =>
	checkHttpResponseStatus('education', 201, 'POST', payload);

export const addWork = async (payload: WorkSaveData): Promise<boolean> =>
	checkHttpResponseStatus('work', 201, 'POST', payload);

export const deleteWork = async (id: string): Promise<boolean> =>
	checkHttpResponseStatus(`work/${id}`, 204, 'DELETE');

export const deleteEducation = async (id: string): Promise<boolean> =>
	checkHttpResponseStatus(`education/${id}`, 204, 'DELETE');

export const updateEducation = async (id: string, payload: EducationUpdateData): Promise<boolean> =>
	checkHttpResponseStatus(`education/${id}`, 204, 'PATCH', payload);

export const updateWork = async (id: string, payload: WorkUpdateData): Promise<boolean> =>
	checkHttpResponseStatus(`work/${id}`, 204, 'PATCH', payload);
