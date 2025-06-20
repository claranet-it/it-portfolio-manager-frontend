import { Template } from '@models/template';
import { checkHttpResponseStatus, getHttpResponse } from 'src/network/httpRequest';
import { decryptCustomer, decryptProject, decryptTask } from 'src/utils/cipher-entities';

export const getTemplates = async (): Promise<Template[]> => {
	const response = await getHttpResponse<Template[]>('template');

	return Promise.all(
		response.map(async (template: Template) => ({
			...template,
			customer: await decryptCustomer(template.customer),
			project: await decryptProject(template.project),
			task: template.task ? await decryptTask(template.task) : undefined,
		}))
	);
};

export const saveTemplate = async (payload: any): Promise<boolean> =>
	checkHttpResponseStatus('template', 201, 'POST', payload);

export const updateTemplate = async (id: string, payload: any): Promise<boolean> =>
	checkHttpResponseStatus(`template/${id}`, 204, 'PATCH', payload);

export const deleteTemplate = async (id: string): Promise<boolean> =>
	checkHttpResponseStatus(`template/${id}`, 204, 'DELETE');
