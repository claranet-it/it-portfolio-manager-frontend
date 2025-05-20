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

export const deleteTimeEntry = async (entry: TimeEntry): Promise<boolean> => {
	const encryptedTimeEntry = await encryptTimeEntry(entry);

	return checkHttpResponseStatus(`time-entry/mine`, 200, 'DELETE', {
		...encryptedTimeEntry,
		project: encryptedTimeEntry.project.name,
	});
};

export const postTimeEntries = async (
	timeEntry: TimeEntryObject,
	impersonateId?: string
): Promise<boolean> => {
	const encryptedTimeEntry = await encryptTimeEntry<TimeEntryObject>(timeEntry);

	const _timeEntry = {
		...encryptedTimeEntry,
		project: encryptedTimeEntry.project.name,

		// TODO: CHECK THIS - Task could not be a string, if it is, its a problem
		task:
			typeof encryptedTimeEntry.task === 'string'
				? encryptedTimeEntry.task
				: encryptedTimeEntry.task.name,
	};

	return checkHttpResponseStatus(
		impersonateId ? `time-entry/${impersonateId}` : 'time-entry/mine',
		204,
		'POST',
		_timeEntry
	);
};
