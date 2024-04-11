import { QRL, Signal, component$ } from '@builder.io/qwik';

interface selectInterface {
	id: string;
	label?: string;
	value: Signal<string>;
	options: Signal<string[]> | Signal<{ name: string; service_line: string }[]>;
	placeholder?: string;
	onChange$?: QRL;
}

export const Select = component$<selectInterface>(
	({ id, label, value, options, placeholder, onChange$ }) => {
		return (
			<form class='w-full'>
				<label for={id} class='block text-sm font-normal text-dark-gray'>
					{label}
				</label>
				<select
					id={id}
					bind:value={value}
					onChange$={onChange$}
					class='bg-white border border-darkgray-500 text-gray-900 text-sm font-normal rounded-md block w-full p-2.5'
				>
					<option value='' disabled selected hidden>
						{placeholder}
					</option>
					{options?.value.map((option, index) => (
						<option
							key={index}
							value={typeof option === 'string' ? option : option.name}
						>
							{typeof option === 'string' ? option : option.name}
						</option>
					))}
				</select>
			</form>
		);
	}
);
