import { Skill, SkillMatrix } from '@models/skill';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getSkillMatrixMine = async (): Promise<Skill[]> =>
	getHttpResponse<Skill[]>('skill-matrix/mine');

export const pathSkillMatrixMine = async (skill: Skill): Promise<boolean> =>
	checkHttpResponseStatus('skill-matrix/mine', 204, 'PATCH', skill);

export const getSkills = async (company: string = 'it'): Promise<SkillMatrix> => [
	...(await getCompanySkills(company)),
	...(await getNetworkingSkills(company)),
];

export const getCompanySkills = async (company: string = 'it'): Promise<SkillMatrix> =>
	getHttpResponse<SkillMatrix>(`skill-matrix?company=${encodeURIComponent(company)}`);

export const getNetworkingSkills = async (company: string = 'it'): Promise<SkillMatrix> => {
	try {
		let response = await getHttpResponse<SkillMatrix>({
			path: `networking/skills`,
			params: {
				company,
			},
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
