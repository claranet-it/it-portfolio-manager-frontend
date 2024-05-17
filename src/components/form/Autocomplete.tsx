import {
	component$,
	useSignal,
	$,
	Signal,
	QRL,
	useVisibleTask$,
	useComputed$,
} from '@builder.io/qwik';
import { getIcon } from '../icons';

interface AutocompleteInterface {
	id: string;
	label?: string;
	selected: Signal<string>;
	data: Signal<string[]>;
	placeholder: string;
	disabled?: boolean;
	required?: boolean | undefined;
	onChange$?: QRL<(value: string) => Promise<void>>;
}

export const Autocomplete = component$<AutocompleteInterface>(
	({ id, label, selected, data, placeholder, disabled, required, onChange$ }) => {
		const AUTOCOMPLETE_FIELD_ID = `autocomplete-field-${id}`;
		const AUTOCOMPLETE_RESULTS_ID = `autocomplete-results-${id}`;

		const results = useSignal<string[]>([]);

		const showResults = $(() => {
			const searchValue = selected.value.toLowerCase().trim();
			if (searchValue === '') results.value = [];
			// data filtering
			else
				results.value = data.value
					.filter((result) => result.toLocaleLowerCase().startsWith(searchValue))
					.sort();
		});

		const clearText = $(() => {
			selected.value = '';
			results.value = [];
		});

		const onSelect = $((value: string) => {
			selected.value = value;
			results.value = [];
		});

		const resultsStyle = {
			display: results.value.length > 0 ? 'relative' : 'none',
			width: document.getElementById(AUTOCOMPLETE_FIELD_ID)?.offsetWidth,
			marginTop: '4px',
		};

		const borderBgColor = useComputed$(() => {
			return disabled
				? 'bg-dark-gray-50 border-darkgray-300'
				: 'bg-white-100 border-darkgray-500';
		});

		const textColor = useComputed$(() => {
			return disabled ? 'text-darkgray-400' : 'text-dark-gray';
		});

		useVisibleTask$(({ track }) => {
			track(selected);
			onChange$ && onChange$(selected.value);
		});

		return (
			<div class='space-y-1'>
				{label && (
					<label class={`block text-sm font-normal ${textColor.value}`}>{label}</label>
				)}
				<div class='relative w-full'>
					{/* Search icon */}
					<div class='absolute inset-y-0 start-0 flex items-center ps-3 text-gray-500 pointer-events-none'>
						{getIcon('Search')}
					</div>

					<input
						type='text'
						id={AUTOCOMPLETE_FIELD_ID}
						class={`block w-full p-2 ps-10 text-sm ${textColor.value} border rounded-md ${borderBgColor.value} pr-5 truncate`}
						placeholder={placeholder}
						autoComplete='off'
						bind:value={selected}
						onKeyUp$={showResults}
						disabled={disabled}
						required={required}
					/>

					{/* Clear icon */}
					{selected.value !== '' && (
						<div
							class={`absolute inset-y-0 end-2 flex items-center ps-3 ${textColor.value} text-base cursor-pointer`}
							onClick$={clearText}
						>
							{getIcon('Clear')}
						</div>
					)}
				</div>

				<div
					id={AUTOCOMPLETE_RESULTS_ID}
					style={resultsStyle}
					class='absolute flex flex-col z-10 w-full bg-white-100 border border-surface-90 rounded-md divide-y shadow'
				>
					<ul
						class='w-full max-h-96 overflow-y-auto py-2 text-sm text-gray-700'
						aria-labelledby={AUTOCOMPLETE_RESULTS_ID}
					>
						{results.value.map((result, index) => (
							<li key={index} onClick$={() => onSelect(result)}>
								<a href='#' class='block px-4 py-2 hover:bg-gray-100'>
									<>{result}</>
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		);
	}
);
