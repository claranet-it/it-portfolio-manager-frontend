import { Configuration } from '../models/types';
import { getHttpResponse } from '../network/httpRequest';

export const getConfiguration = async (): Promise<Configuration> =>
	getHttpResponse<Configuration>('configuration');
