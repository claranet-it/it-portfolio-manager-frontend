import { Effort, EffortMatrix } from '@models/effort';
import { Month } from '@models/month';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getEffort = async (
	months: number = 3,
	company: string = 'it'
): Promise<EffortMatrix> =>
	getHttpResponse<EffortMatrix>(`effort/next?months=${months}&company=${company}`);

export const putEffort = async (
	uid: string,
	effort: Omit<Effort, 'effort'>,
	month: Month
): Promise<boolean> => checkHttpResponseStatus('effort', 204, 'PUT', { uid, ...effort, ...month });
