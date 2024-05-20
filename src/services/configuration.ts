import { Configuration } from '../models/Month';
import { getHttpResponse } from '../network/httpRequest';

export const getConfiguration = async (): Promise<Configuration> =>
	getHttpResponse<Configuration>('configuration');
