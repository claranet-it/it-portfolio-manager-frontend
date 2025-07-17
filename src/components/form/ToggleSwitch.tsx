import { QRL, Signal, component$, useSignal } from '@builder.io/qwik';

type ToogleSwitchProps = {
	isChecked: boolean | Signal<boolean>;
	label?: string;
	onChange$?: QRL;
	id?: string;
};

export const ToggleSwitch = component$<ToogleSwitchProps>(({ isChecked, label, onChange$, id }) => {
	const checked = typeof isChecked === 'boolean' ? useSignal(isChecked) : isChecked;

	return (
		<label class='items-left flex cursor-pointer'>
			<input
				data-id={id}
				type='checkbox'
				value=''
				class='peer sr-only'
				checked={checked.value}
				onChange$={(_, el) => {
					checked.value = el.checked;
					if (onChange$) {
						onChange$(checked.value);
					}
				}}
			/>
			<div class="peer relative h-6 min-w-11 max-w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-clara-red peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
			{label && <span class='ms-3 text-sm font-medium text-gray-900'>{label}</span>}
		</label>
	);
});
