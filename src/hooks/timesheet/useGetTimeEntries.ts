import { $, useSignal } from '@builder.io/qwik';
import { TimeEntry } from '../../models/timeEntry';
import { getTimeEntries } from '../../services/timeSheet';

export const useGetTimeEntries = (localTimeEntry: TimeEntry[]) => {
	const error = useSignal<string>('');
	const loading = useSignal<boolean>(false);
	const from = useSignal<string>('2024-06-03');
	const to = useSignal<string>('2024-06-09');

	const loadTimeEntries = $(async () => {
		try {
			loading.value = true;
			localTimeEntry.push(...(await getTimeEntries(from.value, to.value)));
			loading.value = false;
		} catch (err) {
			error.value = (err as Error).message;
			loading.value = false;
		}
	});

	return { loadTimeEntries, error, loading };
};
