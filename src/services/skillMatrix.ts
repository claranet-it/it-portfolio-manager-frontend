import { Skill, SkillMatrix } from '@models/skill';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getSkillMatrixMine = async (): Promise<Skill[]> =>
	getHttpResponse<Skill[]>('skill-matrix/mine');

export const getSkillMatrixUser = async (userId: string): Promise<Skill[]> =>
	getHttpResponse<Skill[]>(`skill-matrix/${userId}`);

export const pathSkillMatrixMine = async (skill: Skill): Promise<boolean> =>
	checkHttpResponseStatus('skill-matrix/mine', 204, 'PATCH', skill);

export const pathSkillMatrixUser = async (skill: Skill, userId: string): Promise<boolean> =>
	checkHttpResponseStatus(`skill-matrix/${userId}`, 204, 'PATCH', skill);

export const getSkills = async (): Promise<SkillMatrix> => [
	...(await getCompanySkills()),
	...(await getNetworkingSkills()),
];

export const getCompanySkills = async (): Promise<SkillMatrix> =>
	getHttpResponse<SkillMatrix>(`skill-matrix`);

export const getNetworkingSkills = async (): Promise<SkillMatrix> => {
	try {
		let response = await getHttpResponse<SkillMatrix>({
			path: `networking/skills`,
		});
		response = response.map((el) => {
			const [[companyName, _]] = Object.entries(el);
			el[companyName].isCompany = true;
			return el;
		});

		return Promise.resolve(response);
	} catch (error) {
		const errorMessage = (error as Error).message;
		return Promise.reject(errorMessage);
	}
};
