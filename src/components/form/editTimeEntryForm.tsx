import { component$, Signal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { t } from 'src/locale/labels';
import { formatDateString } from 'src/utils/dates';
import { convertTimeToDecimal } from 'src/utils/timesheet';
import { TimePicker } from './TimePicker';

interface EditTimeEntryFormProps {
	hoursSig: Signal<number | undefined>;
	destriptionSig: Signal<string | undefined>;
	date: Date;
	customer?: Customer;
	project?: Project;
	task?: Task;
}

export const EditTimeEntryForm = component$<EditTimeEntryFormProps>(
	({ hoursSig, destriptionSig, date, customer, project, task }) => {
		//const timeSig = useSignal(timeEntry?.hours);

		return (
			<div class='flex flex-col text-left gap-2'>
				<div class='flex flex-col border-b border-gray-200 pb-3'>
					<h4 class='text-sm font-normal text-dark-gray-900 mb-2'>
						{formatDateString(date, true)}
					</h4>
					<h4 class='text-sm font-normal text-darkgray-500'>{`${t('CLIENT')}: ${customer}`}</h4>
					<h4 class='text-base font-bold text-dark-grey'>{project}</h4>
					<h4 class='text-sm font-normal text-dark-gray-900'>{`${t('TASK')}: ${task}`}</h4>
				</div>

				<div class='flex flex-row gap-2'>
					<div>
						<label class='block mb-1 text-sm font-normal text-dark-grey'>Time</label>
						<TimePicker
							onBlur$={(e: FocusEvent) => {
								const value = (e.target as HTMLInputElement).value;

								const hours = convertTimeToDecimal(value);
								hoursSig.value = hours;
								// handleTimeChange({
								// 	project,
								// 	date: formattedDate,
								// 	hours,
								// 	customer,
								// 	task,
								// } as TimeEntryObject);
							}}
							bindValue={hoursSig.value}
						/>
					</div>

					<div>
						<label class='block mb-1 text-sm font-normal text-dark-grey'>Start</label>
						<TimePicker
							onBlur$={(e: FocusEvent) => {
								const value = (e.target as HTMLInputElement).value;
								//startSig.value = Number(value);
								// const hours = convertTimeToDecimal(value);
								// handleTimeChange({
								// 	project,
								// 	date: formattedDate,
								// 	hours,
								// 	customer,
								// 	task,
								// } as TimeEntryObject);
							}}
						/>
					</div>

					<div>
						<label class='block mb-1 text-sm font-normal text-dark-grey'>End</label>
						<TimePicker
							onBlur$={(e: FocusEvent) => {
								const value = (e.target as HTMLInputElement).value;
								// const hours = convertTimeToDecimal(value);
								// handleTimeChange({
								// 	project,
								// 	date: formattedDate,
								// 	hours,
								// 	customer,
								// 	task,
								// } as TimeEntryObject);
							}}
						/>
					</div>
				</div>

				<label
					for='timeEntry-description'
					class='block mb-1 text-sm font-normal text-dark-grey'
				>
					{t('DESCRIPTION_LABEL')}
				</label>
				<textarea
					id='timeEntry-description'
					rows={4}
					class='block py-2 px-3 w-full text-sm text-gray-900 bg-white-100 rounded-md border border-gray-500 resize-none'
					placeholder={t('DESCRIPTION_INSER_LABEL')}
					bind:value={destriptionSig}
				></textarea>
			</div>
		);
	}
);
