import { BackgroundTemplatesList } from '@models/backgroundTemplates';
import { getHttpResponse } from 'src/network/httpRequest';

export const getBackgroundTemplates = async (): Promise<BackgroundTemplatesList> =>
	getHttpResponse<BackgroundTemplatesList>('background-template');

export const getBackgroundTemplateUrl = async (key: string): Promise<string> =>
	getHttpResponse<string>(
		`background-template/${encodeURIComponent(key)}`,
		'GET',
		undefined,
		true
	);
