import { QRL, Signal, component$, useComputed$ } from '@builder.io/qwik';
import { getIcon } from '../icons';
import { format } from 'date-fns';

interface DataRangeProps {
	from: Signal<Date>;
	to: Signal<Date>;
	nextAction: QRL;
	prevAction: QRL;
}

export const DataRange = component$<DataRangeProps>(({ from, to, nextAction, prevAction }) => {
	const currenDataRange = useComputed$(() => {
		return format(from.value, 'MMM dd, yyyy') + ' - ' + format(to.value, 'MMM dd, yyyy');
	});

	return (
		<div class='flex flex-col space-y-0'>
			<label for='input-group-1' class='block text-sm font-normal text-dark-grey'>
				Select data range
			</label>
			<div class='flex flex-row space-x-2'>
				<div class='relative'>
					<div class='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-dark-grey'>
						{getIcon('Calendar')}
					</div>
					<input
						type='text'
						id='input-group-1'
						disabled
						class='bg-white w-60 border border-darkgray-500 text-dark-grey text-sm rounded-md block w-full px-2.5 py-3 ps-8'
						value={currenDataRange.value}
					/>
				</div>

				<button
					onClick$={prevAction}
					class='border border-darkgray-500 rounded-md text-dark-grey py-2 px-3'
				>
					{getIcon('ArrowLeft')}
				</button>
				<button
					onClick$={nextAction}
					class='border border-darkgray-500 rounded-md text-dark-grey py-2 px-3'
				>
					{getIcon('ArrowRight')}
				</button>
			</div>
		</div>
	);
});
