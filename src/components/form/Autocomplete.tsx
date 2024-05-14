import { component$, useSignal, $, Signal } from '@builder.io/qwik';

interface AutocompleteInterface {
	id: string;
	selected: Signal<string>;
	data: Signal<string[]>;
	placeholder: string;
	disabled?: boolean;
}

export const Autocomplete = component$<AutocompleteInterface>(
	({ id, selected, data, placeholder, disabled }) => {
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
			marginTop: '0px',
		};

		return (
			<>
				<div class='relative w-full'>
					{/* Search icon */}
					<div class='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
						<svg
							class='w-4 h-4 text-gray-500'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 20 20'
						>
							<path
								stroke='currentColor'
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
							/>
						</svg>
					</div>

					<input
						type='text'
						id={AUTOCOMPLETE_FIELD_ID}
						class='block w-full p-2 ps-10 text-sm text-gray-900 border border-darkgray-500 rounded-md bg-white-100  pr-5 truncate'
						placeholder={placeholder}
						autoComplete='off'
						bind:value={selected}
						onKeyUp$={showResults}
						disabled={disabled}
						required
					/>

					{/* Clear icon */}
					{selected.value !== '' && (
						<div
							class='absolute inset-y-0 end-2 flex items-center ps-3 cursor-pointer'
							onClick$={clearText}
						>
							<svg
								class='w-4 h-4 text-gray-500'
								aria-hidden='true'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 25 25'
							>
								<path
									stroke='currentColor'
									fill='currentColor'
									stroke-width='1'
									stroke-linecap='round'
									stroke-linejoin='round'
									d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z'
								/>
							</svg>
						</div>
					)}
				</div>

				<div
					id={AUTOCOMPLETE_RESULTS_ID}
					style={resultsStyle}
					class='absolute flex flex-col z-10 w-full bg-white-100 rounded-md divide-y shadow'
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
			</>
		);
	}
);
