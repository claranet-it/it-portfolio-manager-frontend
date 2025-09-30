import { NetworkCompany, NetworkingCompanies } from '@models/networking';
import { SkillMatrix } from '@models/skill';
import { checkHttpResponseStatus, getHttpResponse } from 'src/network/httpRequest';

export const getExistingConnections = async () =>
	getHttpResponse<NetworkingCompanies[]>('companyConnections/mine');

export const getAvailableConnections = async () =>
	getHttpResponse<NetworkCompany[]>('company/networking/available');

export const getAllCompanies = async () =>
	getHttpResponse<NetworkCompany[]>('company?excludeMine=true');

export const setCompaniesConnection = async (requesterId: string, correspondentId: string) =>
	checkHttpResponseStatus('companyConnections', 204, 'POST', {
		requesterId,
		correspondentId,
	});

export const removeCompaniesConnection = async (requesterId: string, correspondentId: string) =>
	checkHttpResponseStatus('companyConnections', 204, 'DELETE', {
		requesterId,
		correspondentId,
	});

export const getNetworkingSkills = async (): Promise<SkillMatrix> => {
	try {
		let response = await getHttpResponse<SkillMatrix>({
			path: `networking/skills?includeUnconnectedCompanies=true`,
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
