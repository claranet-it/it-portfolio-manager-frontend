import { TimeEntry } from '../models/timeEntry';
import { getHttpResponse } from '../network/httpRequest';

export const getTimeEntries = async (from: string, to: string): Promise<TimeEntry[]> =>
	getHttpResponse<TimeEntry[]>(`time-entry/mine?from=${from}&to=${to}`);
