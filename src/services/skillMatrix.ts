import { Skill, SkillMatrix } from '@models/Skill';
import { getHttpResponse, checkHttpResponseStatus } from '../network/httpRequest';

export const getSkillMatrixMine = async (): Promise<Skill[]> =>
	getHttpResponse<Skill[]>('skill-matrix/mine');

export const pathSkillMatrixMine = async (skill: Skill): Promise<boolean> =>
	checkHttpResponseStatus('skill-matrix/mine', 204, 'PATCH', skill);

export const getSkills = async (company: string = 'it'): Promise<SkillMatrix> =>
	getHttpResponse<SkillMatrix>(`skill-matrix?company=${company}`);
