import { TimeEntry, TimeEntryObject } from '../models/timeEntry';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getTimeEntries = async (from: string, to: string): Promise<TimeEntry[]> =>
	getHttpResponse<TimeEntry[]>(`time-entry/mine?from=${from}&to=${to}`);

export const postTimeEntries = async (timeEntry: TimeEntryObject): Promise<boolean> =>
	checkHttpResponseStatus('time-entry/mine', 204, 'POST', timeEntry);
