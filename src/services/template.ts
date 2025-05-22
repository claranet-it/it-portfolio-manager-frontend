import { Template } from '@models/template';
import { checkHttpResponseStatus, getHttpResponse } from 'src/network/httpRequest';

export const getTemplates = async (): Promise<Template[]> =>
	getHttpResponse<Template[]>('template');

export const saveTemplate = async (payload: any): Promise<boolean> =>
	checkHttpResponseStatus('template', 201, 'POST', payload);

export const updateTemplate = async (id: string, payload: any): Promise<boolean> =>
	checkHttpResponseStatus(`template/${id}`, 204, 'PATCH', payload);

export const deleteTemplate = async (id: string): Promise<boolean> =>
	checkHttpResponseStatus(`template/${id}`, 204, 'DELETE');
