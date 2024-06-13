import { $, Signal, useStore, useVisibleTask$ } from '@builder.io/qwik';

import { t } from '../../locale/labels';
import { TimeEntry, TimeEntryObject } from '../../models/timeEntry';
import { deleteTimeEntry, getTimeEntries, postTimeEntries } from '../../services/timeSheet';
import { formatDateString } from '../../utils/dates';
import { isEqualEntries } from '../../utils/timesheet';
import { useNotification } from '../useNotification';

export const useTimeEntries = (newTimeEntry: Signal<TimeEntry | undefined>) => {
	const state = useStore({
		dataTimeEntries: [] as TimeEntry[],
		error: '',
		loading: false,
	});

	const { addEvent } = useNotification();

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

	const updateTimeEntries = $(async (timeEntry: TimeEntryObject) => {
		try {
			await postTimeEntries(timeEntry);
			addEvent({
				message: t('EFFORT_SUCCESSFULLY_UPDATED'),
				type: 'success',
				autoclose: true,
			});
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message: message,
				type: 'danger',
			});
		}
	});

	const deleteProjectEntries = $((entry: TimeEntry) => {
		const erasableEntries = state.dataTimeEntries.filter((_entry) =>
			isEqualEntries(_entry, entry)
		);
		try {
			state.loading = true;
			erasableEntries.map(async (entry) => {
				await deleteTimeEntry(entry);
			});
			// Remove deleted item
			state.dataTimeEntries = state.dataTimeEntries.filter(
				(_entry) => !isEqualEntries(_entry, entry)
			);
			state.loading = false;
			addEvent({
				message: t('TIMEENTRIES_ROW_SUCCESSFULLY_DELETED'),
				type: 'success',
				autoclose: true,
			});
			console.log(state.dataTimeEntries);
		} catch (error) {
			state.loading = false;
			const { message } = error as Error;
			addEvent({
				type: 'danger',
				message: message,
			});
		}
	});

	useVisibleTask$(({ track }) => {
		track(newTimeEntry);
		newTimeEntry.value && state.dataTimeEntries.push(newTimeEntry.value);
	});

	return { loadTimeEntries, updateTimeEntries, deleteProjectEntries, state };
};
