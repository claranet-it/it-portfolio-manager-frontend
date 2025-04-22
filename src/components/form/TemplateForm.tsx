import { component$, QRL, Signal, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { initFlowbite } from 'flowbite';
import { t } from '../../locale/labels';
import { UUID } from '../../utils/uuid';
import { DataRange } from './DataRange';
import { Multiselect } from './Multiselect';
import { TimePicker } from './TimePicker';

interface Props {
	from: Signal<Date>;
	to: Signal<Date>;
	daysSelected: Signal<string[]>;
	description: Signal<string>;
	timeHours: Signal<number>;
	handleTime: QRL;
}

export const TemplateForm = component$<Props>(
	({ from, to, daysSelected, description, timeHours, handleTime }) => {
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

		return (
			<>
				<div class='flex justify-between'>
					<div>
						<label class='block text-sm font-normal text-dark-grey'>
							{t('TIME_LABEL')}
						</label>
						<TimePicker
							hideOptions={true}
							bindValue={timeHours.value}
							onChange$={handleTime}
							required
						/>
					</div>
					<DataRange
						title={t('TIME_PERIOD_LABEL')}
						from={from}
						to={to}
						modalId={UUID()}
					/>
				</div>
				<Multiselect
					id={UUID() + '-daytime'}
					label={t('DAYTIME_LABEL')}
					placeholder={t('select_empty_label')}
					value={daysSelected}
					options={daytimeOptions}
					allowSelectAll
					size='auto'
				/>

				<div>
					<label
						for='templating-description'
						class='block text-sm font-normal text-dark-grey'
					>
						{t('DESCRIPTION_LABEL')}
					</label>
					<textarea
						id='templating-description'
						rows={4}
						class='mt-0 block w-full rounded-md border border-gray-500 bg-white-100 p-2.5 text-sm text-gray-900'
						placeholder={t('DESCRIPTION_INSER_LABEL')}
						bind:value={description}
					></textarea>
				</div>
			</>
		);
	}
);
