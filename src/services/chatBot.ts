import { OpenAIResponse } from '../models/openairesponse';
import { getHttpResponse } from '../network/httpRequest';

export const openAI = async (prompt: string, company: string = 'it'): Promise<OpenAIResponse> =>
	getHttpResponse<OpenAIResponse>('openAI', 'POST', { prompt, company });
