import { $, QRL, component$, useComputed$, useSignal } from '@builder.io/qwik';
import { getFormattedHours } from 'src/utils/timesheet';
import { getIcon } from '../icons';

interface TimePickerProps {
	bindValue?: number | undefined;
	onClick$?: QRL;
	onChange$?: QRL;
	onBlur$?: QRL;
	required?: boolean;
	disabled?: boolean;
	hideOptions?: boolean;
}

export const TimePicker = component$<TimePickerProps>(
	({ bindValue = undefined, onClick$, onChange$, onBlur$, required, disabled, hideOptions }) => {
		const signalValue = useSignal(
			bindValue !== undefined && bindValue !== 0 ? getFormattedHours(bindValue) : ''
		);
		const style = useComputed$(() => {
			return disabled
				? 'bg-darkgray-50 text-darkgray-300 border-darkgray-100'
				: 'bg-white-100 text-dark-grey border-darkgray-500';
		});

		const onFocusIn = $(() =>
			signalValue.value === '' ? (signalValue.value = '00:00') : null
		);

		const onFocusOut = $(() =>
			signalValue.value === '00:00' ? (signalValue.value = '') : null
		);

		return (
			<div class='relative m-auto max-w-20 text-center'>
				{!hideOptions && !disabled && (
					<div
						onClick$={onClick$ && onClick$}
						class='bg-items-center absolute end-1 top-2.5 ml-1 flex cursor-pointer'
					>
						{getIcon('V3Dots')}
					</div>
				)}
				<input
					type='time'
					id='time'
					class={`block w-full rounded-md border px-3 py-3 text-sm leading-none ${style.value} mr-1.5`}
					min='00:00'
					bind:value={signalValue}
					onChange$={onChange$}
					onBlur$={onBlur$}
					onFocusIn$={onFocusIn}
					onFocusOut$={onFocusOut}
					disabled={disabled}
					required={required}
				/>
			</div>
		);
	}
);
