import { Configuration } from '@models/configurations';
import { getHttpResponse } from '../network/httpRequest';

export const getConfiguration = async (): Promise<Configuration> =>
	getHttpResponse<Configuration>('configuration');
