import { component$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { t } from 'src/locale/labels';
import { formatDateString } from 'src/utils/dates';

interface EditTimeEntryFormProps {
	date: Date;
	customer?: Customer;
	project?: Project;
	task?: Task;
}

export const EditTimeEntryForm = component$<EditTimeEntryFormProps>(
	({ date, customer, project, task }) => {
		return (
			<div class='flex flex-col text-left'>
				<div class='flex flex-col border-b border-gray-200 pb-3'>
					<h4 class='text-sm font-normal text-dark-gray-900 mb-2'>
						{formatDateString(date, true)}
					</h4>
					<h4 class='text-sm font-normal text-darkgray-500'>{`${t('CLIENT')}: ${customer}`}</h4>
					<h4 class='text-base font-bold text-dark-grey'>{project}</h4>
					<h4 class='text-sm font-normal text-dark-gray-900'>{`${t('TASK')}: ${task}`}</h4>
				</div>
			</div>
		);
	}
);
