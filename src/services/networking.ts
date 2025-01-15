import { NetworkCompany } from '@models/networking';
import { checkHttpResponseStatus, getHttpResponse } from 'src/network/httpRequest';

export const getExistingConnections = async () =>
	getHttpResponse<NetworkCompany[]>('companyConnections/mine');

export const getAvailableConnections = async () =>
	getHttpResponse<NetworkCompany[]>('company/networking/available');

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
