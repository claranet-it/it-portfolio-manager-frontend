import { TimeEntry, TimeEntryObject } from '../models/timeEntry';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getTimeEntries = async (
	from: string,
	to: string,
	impersonateId?: string
): Promise<TimeEntry[]> =>
	getHttpResponse<TimeEntry[]>({
		path: impersonateId ? `time-entry/${impersonateId}` : `time-entry/mine`,
		params: {
			from,
			to,
		},
	});

export const deleteTimeEntry = async (entry: TimeEntry): Promise<boolean> =>
	checkHttpResponseStatus(`time-entry/mine`, 200, 'DELETE', {
		...entry,
		customer: entry.customer.id,
		project: entry.project.name,
	});

export const postTimeEntries = async (
	timeEntry: TimeEntryObject,
	impersonateId?: string
): Promise<boolean> => {
	const _timeEntry = {
		...timeEntry,
		customer: timeEntry.customer.id,
		project: timeEntry.project.name,
		task: typeof timeEntry.task === 'string' ? timeEntry.task : timeEntry.task.name,
	};

	return checkHttpResponseStatus(
		impersonateId ? `time-entry/${impersonateId}` : 'time-entry/mine',
		204,
		'POST',
		_timeEntry
	);
};
