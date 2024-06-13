import { $, Signal, useStore, useVisibleTask$ } from '@builder.io/qwik';

import { TimeEntry } from '../../models/timeEntry';
import { deleteTimeEntry, getTimeEntries } from '../../services/timeSheet';
import { formatDateString } from '../../utils/dates';
import { isEqualEntries } from '../../utils/timesheet';

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

	const deleteProjectEntries = $((entry: TimeEntry) => {
		const erasableEntries = state.dataTimeEntries.filter((_entry) =>
			isEqualEntries(_entry, entry)
		);
		try {
			state.loading = true;
			erasableEntries.map(async (entry) => {
				const result = await deleteTimeEntry(entry);
				//if (result) // delete
			});
		} catch (error) {
			state.loading = false;
		}
	});

	useVisibleTask$(({ track }) => {
		track(newTimeEntry);
		newTimeEntry.value && state.dataTimeEntries.push(newTimeEntry.value);
	});

	return { state, loadTimeEntries, deleteProjectEntries };
};
