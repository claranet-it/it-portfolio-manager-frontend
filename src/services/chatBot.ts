import { OpenAIResponse } from '../models/openAIResponse';
import { getHttpResponse } from '../network/httpRequest';

export const openAI = async (prompt: string, company: string = 'it'): Promise<OpenAIResponse> =>
	getHttpResponse<OpenAIResponse>('openAI', 'POST', { prompt, company });
