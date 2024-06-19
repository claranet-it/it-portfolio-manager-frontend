import { Signal, component$ } from '@builder.io/qwik';

interface ToogleSwitchProps {
	isChecked: Signal<boolean>;
	label: string;
}

export const ToggleSwitch = component$<ToogleSwitchProps>(({ isChecked, label }) => {
	return (
		<label class='flex items-left cursor-pointer'>
			<input type='checkbox' value='' class='sr-only peer' bind:checked={isChecked} />
			<div class="relative min-w-11 max-w-11 h-6 bg-gray-200  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full  after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all  peer-checked:bg-clara-red"></div>
			<span class='ms-3 text-sm font-medium text-gray-900'>{label}</span>
		</label>
	);
});
