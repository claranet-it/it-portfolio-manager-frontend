import { Configuration } from '../models/Configurations';
import { getHttpResponse } from '../network/httpRequest';

export const getConfiguration = async (): Promise<Configuration> =>
	getHttpResponse<Configuration>('configuration');
