import { component$, QRL, Signal, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { initFlowbite } from 'flowbite';
import { t } from '../../locale/labels';
import { UUID } from '../../utils/uuid';
import { DataRange } from './DataRange';
import { Multiselect } from './Multiselect';
import { TimePicker } from './TimePicker';

interface Props {
	customer?: Customer;
	project?: Project;
	task?: Task;
	from: Signal<Date>;
	to: Signal<Date>;
	daysSelected: Signal<string[]>;
	timeHours: Signal<number>;
	handleTime: QRL;
	editMode: boolean;
}

export const TemplateForm = component$<Props>(
	({ customer, project, task, from, to, daysSelected, timeHours, handleTime, editMode }) => {
		console.log('#### timeHours', timeHours);
		const daytimeOptions = useSignal([
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
			'Sunday',
		]);

		useVisibleTask$(() => {
			initFlowbite();
		});

		const ID = UUID();

		return (
			<div id={`template-form-${ID}`}>
				{editMode && (
					<div class='flex flex-col border-b pb-3'>
						<h4 class='text-sm font-normal text-darkgray-500'>
							{`${t('CLIENT')}: ${customer}`}
						</h4>
						<h4 class='text-base font-bold text-dark-grey'>{project?.name}</h4>
						{task && (
							<h4 class='text-dark-gray-900 text-sm font-normal'>
								{`${t('TASK')}: ${task.name}`}
							</h4>
						)}
					</div>
				)}
				<div class='flex justify-between'>
					<div>
						<label class='block text-sm font-normal text-dark-grey'>
							{t('TIME_LABEL') + '*'}
						</label>
						<TimePicker
							hideOptions={true}
							bindValue={timeHours.value}
							onChange$={handleTime}
							required
						/>
					</div>
					<DataRange
						title={t('TIME_PERIOD_LABEL') + '*'}
						from={from}
						to={to}
						modalId={UUID()}
					/>
				</div>
				<Multiselect
					id={UUID() + '-daytime'}
					label={t('DAYTIME_LABEL') + '*'}
					placeholder={t('select_empty_label')}
					value={daysSelected}
					options={daytimeOptions}
					allowSelectAll
					size='auto'
				/>
			</div>
		);
	}
);
