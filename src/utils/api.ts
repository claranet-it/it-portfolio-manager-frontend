import { checkStatusRequest, getHttpResponse } from './http-requests';
import {
    Configuration,
    Effort,
    Month,
    SetUserProfile,
    Skill,
    SkillMatrix,
    UserMe,
} from './types';

export const getUserMe = async (): Promise<UserMe> =>
    getHttpResponse<UserMe>('user/me');

export const setUserProfile = async (body: SetUserProfile): Promise<boolean> =>
    checkStatusRequest('user/profile', 201, 'POST', body);

export const getConfiguration = async (): Promise<Configuration> =>
    getHttpResponse<Configuration>('configuration');

export const getSkillMatrixMine = async (): Promise<Skill[]> =>
    getHttpResponse<Skill[]>('skill-matrix/mine');

export const pathSkillMatrixMine = async (skill: Skill): Promise<boolean> =>
    checkStatusRequest('skill-matrix/mine', 204, 'PATCH', skill);

export const getSkills = async (company: string = 'it'): Promise<SkillMatrix> =>
    getHttpResponse<SkillMatrix>(`skill-matrix?company=${company}`);

export const getEffort = async (): Promise<Effort> =>
    getHttpResponse<Effort>('effort');

export const putEffort = async (uid: string, month: Month): Promise<boolean> =>
    checkStatusRequest('effort', 204, 'PUT', { uid, ...month });
