import { checkHttpResponseStatus, getHttpResponse } from './httpRequest';
import {
	Configuration,
	Customer,
	Effort,
	EffortMatrix,
	Month,
	OpenAIResponse,
	Project,
	SetUserProfile,
	Skill,
	SkillMatrix,
	Task,
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

export const getEffort = async (
	months: number = 3,
	company: string = 'it'
): Promise<EffortMatrix> =>
	getHttpResponse<EffortMatrix>(`effort/next?months=${months}&company=${company}`);

export const putEffort = async (
	uid: string,
	effort: Omit<Effort, 'effort'>,
	month: Month
): Promise<boolean> => checkHttpResponseStatus('effort', 204, 'PUT', { uid, ...effort, ...month });

export const openAI = async (prompt: string, company: string = 'it'): Promise<OpenAIResponse> =>
	getHttpResponse<OpenAIResponse>('openAI', 'POST', { prompt, company });

export const getCustomers = async (company: string = 'it'): Promise<Customer[]> =>
	getHttpResponse<Customer[]>(`task/customer?company=${company}`);

export const getProjects = async (company: string = 'it', customer: Customer): Promise<Project[]> =>
	getHttpResponse<Project[]>(`task/project?company=${company}&customer=${customer}`);

export const getTasks = async (
	company: string = 'it',
	customer: Customer,
	project: Project
): Promise<Task[]> =>
	getHttpResponse<Task[]>(`task/task?company=${company}&customer=${customer}&project=${project}`);
