import { QRL, Signal, component$, useComputed$ } from '@builder.io/qwik';
import { formatDateString } from 'src/utils/dates';
import { getIcon } from '../icons';

interface DataRangeProps {
	from: Signal<Date>;
	to: Signal<Date>;
	nextAction: QRL;
	prevAction: QRL;
}

export const DataRange = component$<DataRangeProps>(({ from, to, nextAction, prevAction }) => {
	const currenDataRange = useComputed$(() => {
		return formatDateString(from.value) + ' - ' + formatDateString(to.value);
	});

	return (
		<div class='flex flex-col space-y-0'>
			<label for='input-group-1' class='block text-sm font-normal text-dark-grey'>
				Select data range
			</label>
			<div class='flex flex-row space-x-2'>
				<div class='relative'>
					<div class='pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-dark-grey'>
						{getIcon('Calendar')}
					</div>
					<input
						type='text'
						id='input-group-1'
						disabled
						class='block w-60 w-full min-w-56 rounded-md border border-darkgray-500 bg-white px-2.5 py-2.5 ps-8 text-sm text-dark-grey'
						value={currenDataRange.value}
					/>
				</div>

				<button
					onClick$={prevAction}
					class='rounded-md border border-darkgray-500 px-3 py-2 text-dark-grey'
				>
					{getIcon('ArrowLeft')}
				</button>
				<button
					onClick$={nextAction}
					class='rounded-md border border-darkgray-500 px-3 py-2 text-dark-grey'
				>
					{getIcon('ArrowRight')}
				</button>
			</div>
		</div>
	);
});
