import {
	$,
	QRL,
	Signal,
	component$,
	useComputed$,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import { useDebounce } from '../../hooks/useDebounce';
import { getIcon } from '../icons';

interface AutocompleteInterface {
	id: string;
	label?: string;
	selected: Signal<string>;
	data: string[] | Signal<string[]>;
	placeholder: string;
	disabled?: boolean;
	required?: boolean | undefined;
	showAll?: boolean;
	onChange$?: QRL<(value: string) => Promise<void>>;
}

export const Autocomplete = component$<AutocompleteInterface>(
	({ id, label, selected, data, placeholder, disabled, required, showAll, onChange$ }) => {
		const AUTOCOMPLETE_FIELD_ID = `autocomplete-field-${id}`;
		const AUTOCOMPLETE_RESULTS_ID = `autocomplete-results-${id}`;
		const autocompleteData = useSignal(Array.isArray(data) ? data : data.value);

		const results = useSignal<string[]>([]);
		const debounced = useDebounce(selected, 300);

		const showResults = $(() => {
			const searchValue = selected.value.toLowerCase().trim();
			if (searchValue === '') {
				results.value = showAll ? autocompleteData.value : [];
			} else {
				results.value = autocompleteData.value
					.filter((result) => result.toLocaleLowerCase().includes(searchValue))
					.sort();
			}
		});

		const clearText = $(() => {
			debounced.value = '';
			selected.value = '';
			results.value = [];
		});

		const onSelect = $((value: string) => {
			debounced.value = value;
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
			track(debounced);
			onChange$ && onChange$(debounced.value);
		});

		useVisibleTask$(({ track }) => {
			track(() => (Array.isArray(data) ? data : data.value));
			autocompleteData.value = Array.isArray(data) ? data : data.value;
		});

		return (
			<div class='space-y-1'>
				{label && (
					<label class={`block text-sm font-normal ${textColor.value}`}>{label}</label>
				)}
				<div class='relative w-full'>
					{/* Search icon */}
					<div class='pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-gray-500'>
						{getIcon('Search')}
					</div>

					<input
						type='text'
						id={AUTOCOMPLETE_FIELD_ID}
						class={`block w-full p-2 ps-10 text-sm ${textColor.value} rounded-md border ${borderBgColor.value} truncate pr-5`}
						placeholder={placeholder}
						autoComplete='off'
						bind:value={selected}
						onKeyUp$={showResults}
						disabled={disabled}
						required={required}
						onMouseUp$={showAll ? showResults : undefined}
					/>

					{/* Clear icon */}
					{selected.value !== '' && (
						<div
							class={`absolute inset-y-0 end-2 flex items-center ps-3 ${textColor.value} cursor-pointer text-base`}
							onClick$={clearText}
						>
							{getIcon('Clear')}
						</div>
					)}
				</div>

				<div
					id={AUTOCOMPLETE_RESULTS_ID}
					style={resultsStyle}
					class='absolute z-10 flex w-full flex-col divide-y rounded-md border border-surface-90 bg-white-100 shadow'
				>
					<ul
						class='max-h-96 w-full overflow-y-auto py-2 text-sm text-gray-700'
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
