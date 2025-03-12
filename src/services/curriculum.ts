import { CurriculumVitaeData } from '@models/curriculumVitae';
import { getHttpResponse } from 'src/network/httpRequest';

export const getCurriculum = async (): Promise<CurriculumVitaeData> =>
	getHttpResponse<CurriculumVitaeData>('curriculum');

export const getCurriculumByEmail = async (email: string): Promise<CurriculumVitaeData> =>
	getHttpResponse<CurriculumVitaeData>(`curriculum/${email}`);
