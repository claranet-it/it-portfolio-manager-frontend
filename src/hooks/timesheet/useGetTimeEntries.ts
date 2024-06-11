import { $, Signal, useStore, useVisibleTask$ } from '@builder.io/qwik';

import { TimeEntry } from '../../models/timeEntry';
import { getTimeEntries } from '../../services/timeSheet';
import { formatDateString } from '../../utils/dates';

export const useGetTimeEntries = (newTimeEntry: Signal<TimeEntry | undefined>) => {
	const state = useStore({
		dataTimeEntries: [] as TimeEntry[],
		error: '',
		loading: false,
	});

	const loadTimeEntries = $(async (from: Signal<Date>, to: Signal<Date>) => {
		try {
			state.loading = true;
			state.dataTimeEntries = await getTimeEntries(
				formatDateString(from.value),
				formatDateString(to.value)
			);
			state.loading = false;
		} catch (err) {
			state.error = (err as Error).message;
			state.loading = false;
		}
	});

	useVisibleTask$(({ track }) => {
		track(newTimeEntry);
		newTimeEntry.value && state.dataTimeEntries.push(newTimeEntry.value);
	});

	return { loadTimeEntries, state };
};
