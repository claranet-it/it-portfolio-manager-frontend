import { $, Signal, useContext, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';

import { AppContext } from 'src/app';
import { t } from '../../locale/labels';
import { TimeEntry, TimeEntryObject } from '../../models/timeEntry';
import { deleteTimeEntry, getTimeEntries, postTimeEntries } from '../../services/timeSheet';
import { formatDateString } from '../../utils/dates';
import { isEqualEntries } from '../../utils/timesheet';
import { useNotification } from '../useNotification';

export const useTimeEntries = (newTimeEntry: Signal<TimeEntry | undefined>) => {
	const appStore = useContext(AppContext);
	const state = useStore({
		dataTimeEntries: [] as TimeEntry[],
		error: '',
		from: useSignal<Date>(new Date()),
		to: useSignal<Date>(new Date()),
	});

	const { addEvent } = useNotification();

	const loadTimeEntries = $(async (from: Signal<Date>, to: Signal<Date>, reset?: boolean) => {
		state.from = from;
		state.to = to;
		try {
			appStore.isLoading = true;
			const timeEntries = await getTimeEntries(
				formatDateString(from.value),
				formatDateString(to.value)
			);

			if (state.dataTimeEntries.length === 0 || reset) {
				state.dataTimeEntries = timeEntries;
			} else {
				const indexedEntries = state.dataTimeEntries.map((_entry, index) => ({
					index: index,
					entry: _entry,
				}));

				timeEntries.map((entry) => {
					const existingEntries = indexedEntries.filter((_entry) =>
						isEqualEntries(_entry.entry, entry)
					);

					if (existingEntries.length === 0) {
						state.dataTimeEntries.push(entry);
					}

					existingEntries.some((_existingEntry) => {
						if (
							_existingEntry.entry.index !== undefined &&
							_existingEntry.entry.index === entry.index
						) {
							state.dataTimeEntries[_existingEntry.index] = {
								...state.dataTimeEntries[_existingEntry.index],
								hours: entry.hours,
								description: entry.description,
								startHour: entry.startHour,
								endHour: entry.endHour,
							};

							return true;
						} else {
							if (_existingEntry.entry.date === '') {
								state.dataTimeEntries[_existingEntry.index] = entry;
							}
							return true;
						}
					});
				});
			}
			appStore.isLoading = false;
		} catch (err) {
			state.error = (err as Error).message;
			appStore.isLoading = false;
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
			loadTimeEntries(state.from, state.to);
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message: message,
				type: 'danger',
			});
		}
	});

	const deleteProjectEntries = $((entry: TimeEntry) => {
		const erasableEntries = state.dataTimeEntries.filter(
			(_entry) => isEqualEntries(_entry, entry) && _entry.index === entry.index
		);
		try {
			appStore.isLoading = true;
			erasableEntries.map(async (entry) => {
				await deleteTimeEntry(entry);
			});
			// Remove deleted item
			state.dataTimeEntries = state.dataTimeEntries.filter(
				(_entry) => !(isEqualEntries(_entry, entry) && _entry.index === entry.index)
			);
			appStore.isLoading = false;
			addEvent({
				message: t('TIMEENTRIES_ROW_SUCCESSFULLY_DELETED'),
				type: 'success',
				autoclose: true,
			});
		} catch (error) {
			appStore.isLoading = false;
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
