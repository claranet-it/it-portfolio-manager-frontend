import { Configuration } from '@models/configuration';
import { getHttpResponse } from '../network/httpRequest';

export const getConfiguration = async (): Promise<Configuration> =>
	getHttpResponse<Configuration>('configuration');
