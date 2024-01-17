import { checkHttpResponseStatus, getHttpResponse } from './http-requests';
import {
	Configuration,
	Effort,
	EffortMatrix,
	Month,
	SetUserProfile,
	Skill,
	SkillMatrix,
	UserMe,
} from './types';

export const getUserMe = async (): Promise<UserMe> => getHttpResponse<UserMe>('user/me');

export const setUserProfile = async (body: SetUserProfile): Promise<boolean> =>
	checkHttpResponseStatus('user/profile', 201, 'POST', body);

export const getConfiguration = async (): Promise<Configuration> =>
	getHttpResponse<Configuration>('configuration');

export const getSkillMatrixMine = async (): Promise<Skill[]> =>
	getHttpResponse<Skill[]>('skill-matrix/mine');

export const pathSkillMatrixMine = async (skill: Skill): Promise<boolean> =>
	checkHttpResponseStatus('skill-matrix/mine', 204, 'PATCH', skill);

export const getSkills = async (company: string = 'it'): Promise<SkillMatrix> =>
	getHttpResponse<SkillMatrix>(`skill-matrix?company=${company}`);

export const getEffort = async (): Promise<EffortMatrix> =>
	getHttpResponse<EffortMatrix>('effort/next');

export const putEffort = async (
	uid: string,
	effort: Omit<Effort, 'effort'>,
	month: Month
): Promise<boolean> => checkHttpResponseStatus('effort', 204, 'PUT', { uid, ...effort, ...month });
