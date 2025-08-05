import { QRL, Signal, component$, useVisibleTask$ } from '@builder.io/qwik';
import { initFlowbite } from 'flowbite';
import { getIcon } from '../icons';

type SearchInputProps = {
	callback: QRL;
	value: Signal<string | undefined>;
};

export const SearchInput = component$<SearchInputProps>(({ value, callback }) => {
	useVisibleTask$(() => {
		initFlowbite();
	});

	return (
		<div class='relative w-full py-2'>
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
	);
});
