import { Signal, component$, useComputed$, useSignal } from '@builder.io/qwik';

interface inputInterface {
	id?: string | undefined;
	type?: string;
	label?: string;
	bindValue?: Signal<string> | undefined;
	value?: string | ReadonlyArray<string> | number | undefined | null | FormDataEntryValue;
	placeholder?: string;
	styleClass?: string;
	styleLabel?: string;
	bgColor?: string;
	disabled?: boolean;
	hidden?: boolean;
	onChange$?: (event: Event, element: HTMLInputElement) => any;
	onInput$?: (event: Event, element: HTMLInputElement) => any;
}

export const Input = component$<inputInterface>(
	({
		id,
		type = 'text',
		label,
		bindValue = undefined,
		value,
		placeholder,
		styleClass = 'w-full md:max-w-[300px] lg:max-w-[300px]',
		styleLabel = 'block text-sm font-normal',
		bgColor = 'bg-white',
		disabled = false,
		hidden = false,
		onChange$,
		onInput$,
	}) => {
		const _bindValue = bindValue ? bindValue : useSignal(undefined);

		const borderBgColor = useComputed$(() => {
			return disabled
				? 'bg-dark-gray-50 border-darkgray-300'
				: `${bgColor} border-darkgray-500`;
		});

		const textColor = useComputed$(() => {
			return disabled ? 'text-darkgray-400' : 'text-dark-gray';
		});

		return (
			<form class={[styleClass, hidden ? 'hidden' : '']}>
				<label class={`${styleLabel} ${textColor.value}`}>{label}</label>

				<input
					type={type}
					id={id}
					placeholder={placeholder}
					class={`block w-full rounded-md border ${borderBgColor.value} p-2.5 text-sm ${textColor.value}`}
					{...(bindValue ? { 'bind:value': _bindValue } : {})}
					value={value}
					disabled={disabled}
					onChange$={onChange$}
					onInput$={onInput$}
				/>
			</form>
		);
	}
);
