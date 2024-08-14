import { $, component$, QRL, useSignal, useStore } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { Day, TimeEntry, TimeEntryObject } from '@models/timeEntry';
import { t } from 'src/locale/labels';
import { formatDateString } from 'src/utils/dates';
import { convertTimeToDecimal, getComputedHours, getFormattedHours } from 'src/utils/timesheet';
import { EditTimeEntryForm } from '../form/editTimeEntryForm';
import { TimePicker } from '../form/TimePicker';
import { Modal } from '../modals/Modal';

interface TimeEntryElementProps {
	id: string;
	day: Day;
	entry: TimeEntry | undefined;
	timeEntriesState: Record<string, Record<string, number>>;
	handleTimeChange: QRL<(timeEntryObject: TimeEntryObject) => void>;
	entryInfo: {
		customer: Customer | undefined;
		project: Project | undefined;
		task: Task | undefined;
	};
}

export const TimeEntryElement = component$<TimeEntryElementProps>(
	({ id, day, entry, timeEntriesState, handleTimeChange, entryInfo }) => {
		const formattedDate = formatDateString(day.date);
		const hours = entry ? timeEntriesState[entry.project.name]?.[formattedDate] || 0 : 0;

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
				const confirmationEntry = entry ?? {
					customer: entryInfo.customer,
					project: entryInfo.project,
					task: entryInfo.task,
					date: formattedDate,
				};
				handleTimeChange({
					...confirmationEntry,
					hours: hoursSig.value,
					description: destriptionSig.value,
					startHour: getFormattedHours(startSig.value),
					endHour: getFormattedHours(endSig.value),
				} as TimeEntryObject);
			}),
			cancelLabel: t('ACTION_CANCEL'),
			confirmLabel: t('ACTION_CONFIRM'),
		});

		const handleBlur = $((e: FocusEvent) => {
			const value = (e.target as HTMLInputElement).value;
			hoursSig.value = convertTimeToDecimal(value);
			const {
				hours: cHours,
				startHour: cStart,
				endHour: cEnd,
			} = getComputedHours(startSig.value, endSig.value, hoursSig.value);

			handleTimeChange({
				project: entryInfo.project,
				date: formattedDate,
				hours: cHours,
				startHour: getFormattedHours(cStart),
				endHour: getFormattedHours(cEnd),
				description: destriptionSig.value,
				customer: entryInfo.customer,
				task: entryInfo.task,
				index: entry?.index,
			} as TimeEntryObject);
		});

		return (
			<>
				<TimePicker
					onClick$={() => {
						modalState.isVisible = true;
					}}
					onBlur$={handleBlur}
					bindValue={entry ? entry.hours : hours}
				/>

				{startSig.value !== 0 && endSig.value !== 0 && (
					<p class='text-xs font-normal text-darkgray-400 mt-1 text-nowrap'>
						{getFormattedHours(startSig.value)} - {getFormattedHours(endSig.value)}
					</p>
				)}

				{modalState.isVisible && (
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
			</>
		);
	}
);
