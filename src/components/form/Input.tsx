import { Signal, component$, useSignal } from '@builder.io/qwik';

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
	onChange$?: (event: Event, element: HTMLInputElement) => any;
}

export const Input = component$<inputInterface>(
	({
		id,
		type = 'text',
		label,
		bindValue = undefined,
		value,
		placeholder,
		styleClass = 'w-full',
		styleLabel = 'block text-sm font-normal text-dark-gray',
		bgColor = 'bg-white',
		disabled = false,
		onChange$,
	}) => {
		const _bindValue = bindValue ? bindValue : useSignal(undefined);

		return (
			<form class={styleClass}>
				<label for={id} class={styleLabel}>
					{label}
				</label>

				<input
					type={type}
					id={id}
					placeholder={placeholder}
					class={
						bgColor +
						' border border-darkgray-500 text-gray-900 text-sm rounded-md block w-full p-2.5'
					}
					bind:value={_bindValue}
					value={value}
					disabled={disabled}
					onChange$={onChange$}
				/>
			</form>
		);
	}
);
