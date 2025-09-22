import { QRL, Signal, component$, useVisibleTask$ } from '@builder.io/qwik';
import { initFlowbite } from 'flowbite';
import { getIcon } from '../icons';

type SearchInputProps = {
	callback: QRL;
	value: Signal<string | undefined>;
	label?: string;
};

export const SearchInput = component$<SearchInputProps>(({ value, callback, label }) => {
	useVisibleTask$(() => {
		initFlowbite();
	});

	return (
		<div>
			<label class={`block py-1 text-sm`}>{label}</label>

			<div class='relative w-full'>
				<div class='pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-gray-500'>
					{getIcon('Search')}
				</div>
				<input
					class={`block h-[36px] w-full truncate rounded-md border border-darkgray-500 p-2 pr-5 ps-10 text-sm`}
					type='text'
					value={value.value}
					placeholder='Search for ...'
					onInput$={(_, el) => callback(el.value)}
				/>
			</div>
		</div>
	);
});
