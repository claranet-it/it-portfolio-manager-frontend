import { TimeEntry, TimeEntryObject } from '../models/timeEntry';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getTimeEntries = async (from: string, to: string): Promise<TimeEntry[]> =>
	getHttpResponse<TimeEntry[]>({
		path: `time-entry/mine`,
		params: {
			from,
			to,
		},
	});

export const deleteTimeEntry = async (entry: TimeEntry): Promise<Boolean> =>
	checkHttpResponseStatus(`time-entry/mine`, 200, 'DELETE', {
		...entry,
		project: entry.project.name,
	});

export const postTimeEntries = async (timeEntry: TimeEntryObject): Promise<boolean> => {
	const _timeEntry = {
		...timeEntry,
		project: timeEntry.project.name,
		task: typeof timeEntry.task === 'string' ? timeEntry.task : timeEntry.task.name,
	};

	return checkHttpResponseStatus('time-entry/mine', 204, 'POST', _timeEntry);
};
