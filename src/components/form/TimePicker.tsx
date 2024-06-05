import { QRL, Signal, component$, useComputed$, useSignal } from '@builder.io/qwik';
import { getIcon } from '../icons';

interface TimePickerProps {
	bindValue?: Signal<string> | undefined;
	onClick$?: QRL;
	onChange$?: QRL;
	required?: boolean;
	disabled?: boolean;
}

export const TimePicker = component$<TimePickerProps>(
	({ bindValue = useSignal('00:00'), onClick$, onChange$, required, disabled }) => {
		const style = useComputed$(() => {
			return disabled
				? 'bg-darkgray-50 text-darkgray-300 border-darkgray-100'
				: 'bg-white-100  text-dark-grey border-darkgray-500';
		});

		return (
			<div class='relative m-auto text-center max-w-20'>
				{!disabled && (
					<div
						onClick$={onClick$ && onClick$}
						class='absolute end-1 top-2.5 ml-1 flex bg-items-center cursor-pointer'
					>
						{getIcon('V3Dots')}
					</div>
				)}
				<input
					type='time'
					id='time'
					class={`block w-full py-3 px-3 leading-none border text-sm rounded-md ${style.value} mr-1.5`}
					min='00:00'
					value='08:56'
					bind:value={bindValue}
					onChange$={onChange$}
					disabled={disabled}
					required={required}
				/>
			</div>
		);
	}
);
