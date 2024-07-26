import { $, component$, QRL, useSignal, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { Day, TimeEntry, TimeEntryObject } from '@models/timeEntry';
import { t } from 'src/locale/labels';
import { formatDateString } from 'src/utils/dates';
import { convertTimeToDecimal, getEndHour, getFormattedHours } from 'src/utils/timesheet';
import { EditTimeEntryForm } from './form/editTimeEntryForm';
import { TimePicker } from './form/TimePicker';
import { Modal } from './modals/Modal';

interface TimeEntryElementProps {
	id: string;
	day: Day;
	entry: TimeEntry | undefined;
	timeEntriesState: Record<string, Record<string, number>>;
	handleTimeChange: QRL<(timeEntryObject: TimeEntryObject) => void>;
	entryInfo: {
		customer: string | undefined;
		project: string | undefined;
		task: string | undefined;
	};
}

export const TimeEntryElement = component$<TimeEntryElementProps>(
	({ id, day, entry, timeEntriesState, handleTimeChange, entryInfo }) => {
		const formattedDate = formatDateString(day.date);
		const hours = entry ? timeEntriesState[entry.hours]?.[formattedDate] || 0 : 0;
		const { weekend } = day;
		const tdClass = `relative py-3 px-4 text-center border border-surface-50 ${weekend ? 'bg-surface-20' : ''}`;

		const destriptionSig = useSignal(entry?.description ?? '');
		const hoursSig = useSignal(entry?.hours ?? 0);
		const startSig = useSignal(entry?.startHour ? convertTimeToDecimal(entry.startHour) : 0);
		const endSig = useSignal(entry?.endHour ? convertTimeToDecimal(entry.endHour) : 0);

		const modalState = useStore<ModalState>({
			title: t('EDIT_TIME_ENTRY'),
			onCancel$: $(() => {
				destriptionSig.value = entry?.description ?? '';
				hoursSig.value = entry?.hours ?? 0;
				startSig.value = entry?.startHour ? convertTimeToDecimal(entry.startHour) : 0;
				endSig.value = entry?.endHour ? convertTimeToDecimal(entry.endHour) : 0;
			}),
			onConfirm$: $(() => {
				handleTimeChange({
					...entry,
					hours: hoursSig.value,
					description: destriptionSig.value,
					startHour: getFormattedHours(startSig.value),
					endHour: getFormattedHours(endSig.value),
				} as TimeEntryObject);
			}),
			cancelLabel: t('ACTION_CANCEL'),
			confirmLabel: t('ACTION_CONFIRM'),
		});

		return (
			<td class={tdClass}>
				<TimePicker
					onClick$={() => {
						modalState.isVisible = true;
					}}
					onBlur$={(e: FocusEvent) => {
						const value = (e.target as HTMLInputElement).value;
						const hours = convertTimeToDecimal(value);
						hoursSig.value = hours;
						const computedEnd = getEndHour(startSig.value, endSig.value, hours);
						if (computedEnd !== endSig.value) {
							endSig.value = computedEnd;
						}

						handleTimeChange({
							project: entryInfo.project,
							date: formattedDate,
							hours,
							startHour: getFormattedHours(startSig.value),
							endHour: getFormattedHours(endSig.value),
							description: destriptionSig.value,
							customer: entryInfo.customer,
							task: entryInfo.task,
						} as TimeEntryObject);
					}}
					bindValue={entry ? entry.hours : hours}
				/>

				{startSig.value !== 0 && endSig.value !== 0 && (
					<p class='text-xs font-normal text-darkgray-400 absolute mt-1 w-[calc(100%-2rem)] text-nowrap'>
						{getFormattedHours(startSig.value)} - {getFormattedHours(endSig.value)}
					</p>
				)}

				{entry && (
					<Modal key={id} state={modalState}>
						<EditTimeEntryForm
							destriptionSig={destriptionSig}
							hoursSig={hoursSig}
							hoursRange={{
								start: startSig,
								end: endSig,
							}}
							date={day.date}
							customer={entryInfo.customer}
							project={entryInfo.project}
							task={entryInfo.task}
						/>
					</Modal>
				)}
			</td>
		);
	}
);
