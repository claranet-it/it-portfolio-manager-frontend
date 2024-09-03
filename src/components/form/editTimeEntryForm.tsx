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
	hoursRange: {
		start: Signal<number>;
		end: Signal<number>;
	};
	customer?: Customer;
	project?: Project;
	task?: Task;
}

export const EditTimeEntryForm = component$<EditTimeEntryFormProps>(
	({ hoursSig, destriptionSig, date, hoursRange, customer, project, task }) => {
		const key = `${task}-${date}-${hoursSig.value}-${hoursRange.start.value}-${hoursRange.end.value}`;
		return (
			<div key={key} class='flex flex-col gap-2 text-left'>
				<div class='flex flex-col border-b border-gray-200 pb-3'>
					<h4 class='text-dark-gray-900 mb-2 text-sm font-normal'>
						{formatDateString(date, true)}
					</h4>
					<h4 class='text-sm font-normal text-darkgray-500'>{`${t('CLIENT')}: ${customer}`}</h4>
					<h4 class='text-base font-bold text-dark-grey'>{project?.name}</h4>
					<h4 class='text-dark-gray-900 text-sm font-normal'>{`${t('TASK')}: ${task}`}</h4>
				</div>

				<div class='flex flex-row gap-2'>
					<div>
						<label class='mb-1 block text-sm font-normal text-dark-grey'>
							{t('TIME_ENTRY_START')}
						</label>
						<TimePicker
							bindValue={hoursRange.start.value}
							onBlur$={(e: FocusEvent) => {
								const value = (e.target as HTMLInputElement).value;

								if (value === '') {
									hoursRange.start.value = 0;
									return;
								}

								const hours = convertTimeToDecimal(value);
								hoursRange.start.value = hours;

								if (hoursSig.value && hoursSig.value > 0) {
									hoursRange.end.value = hours + hoursSig.value;
								}
							}}
						/>
					</div>

					<div>
						<label class='mb-1 block text-sm font-normal text-dark-grey'>
							{t('TIME_ENTRY_END')}
						</label>
						<TimePicker
							bindValue={hoursRange.end.value}
							onBlur$={(e: FocusEvent) => {
								const value = (e.target as HTMLInputElement).value;

								if (value === '') {
									hoursRange.start.value = 0;
									return;
								}

								const hours = convertTimeToDecimal(value);
								hoursRange.end.value = hours;

								if (hoursRange.start.value && hoursRange.start.value > 0) {
									hoursSig.value = hours - hoursRange.start.value;
								}
							}}
						/>
					</div>
				</div>

				<label
					for='timeEntry-description'
					class='mb-1 block text-sm font-normal text-dark-grey'
				>
					{t('DESCRIPTION_LABEL')}
				</label>
				<textarea
					id='timeEntry-description'
					rows={4}
					class='block w-full resize-none rounded-md border border-gray-500 bg-white-100 px-3 py-2 text-sm text-gray-900'
					placeholder={t('DESCRIPTION_INSER_LABEL')}
					bind:value={destriptionSig}
				></textarea>
			</div>
		);
	}
);
