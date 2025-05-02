import { Company } from '@models/company';
import { checkHttpResponseStatus, getHttpResponse } from 'src/network/httpRequest';

export const getCompanyMine = async (): Promise<Company> =>
	getHttpResponse<Company>('company/mine');

export const editCompanyMineImage = async (id: string, image_url: string) =>
	checkHttpResponseStatus(`company/${id}`, 200, 'PATCH', { image_url: image_url });

export const editSkillVisibility = async (id: number, visible: boolean) =>
	checkHttpResponseStatus(`skill/${id}`, 200, 'PATCH', { visible });

export const unsubscribeCompany = async (id: string) =>
	checkHttpResponseStatus(`PATHDADEFINIRE/${id}`, 200, 'DELETE');
