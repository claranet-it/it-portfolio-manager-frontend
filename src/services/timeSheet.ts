import { decryptTimeEntry, encryptTimeEntry } from 'src/utils/cipher-entities';
import { TimeEntry, TimeEntryObject } from '../models/timeEntry';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getTimeEntries = async (
	from: string,
	to: string,
	impersonateId?: string
): Promise<TimeEntry[]> => {
	const response = await getHttpResponse<TimeEntry[]>({
		path: impersonateId ? `time-entry/${impersonateId}` : `time-entry/mine`,
		params: {
			from,
			to,
		},
	});

	return Promise.all(response.map(decryptTimeEntry));
};

export const deleteTimeEntry = async (entry: TimeEntry): Promise<boolean> =>
	checkHttpResponseStatus(`time-entry/mine`, 200, 'DELETE', {
		...entry,
		customer: entry.customer.id,
		project: entry.project.id,
		task: entry.task.id,
	});

export const postTimeEntries = async (
	timeEntry: TimeEntryObject,
	impersonateId?: string
): Promise<boolean> => {
	const encryptedTimeEntry = await encryptTimeEntry<TimeEntryObject>(timeEntry);

	const _timeEntry = {
		...encryptedTimeEntry,
		customer: timeEntry.customer.id,
		project: timeEntry.project.id,
		task: timeEntry.task.id,
	};

	return checkHttpResponseStatus(
		impersonateId ? `time-entry/${impersonateId}` : 'time-entry/mine',
		204,
		'POST',
		_timeEntry
	);
};
