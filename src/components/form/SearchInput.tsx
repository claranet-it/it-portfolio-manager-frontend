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
		<div class='flex w-full flex-row items-center gap-2 px-4 py-2 hover:bg-gray-100'>
			{getIcon('Search')}
			<input
				class='w-full'
				type='text'
				value={value.value}
				onInput$={(_, el) => callback(el.value)}
			/>
		</div>
	);
});
