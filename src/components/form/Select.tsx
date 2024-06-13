import { QRL, Signal, component$, $, useVisibleTask$ } from '@builder.io/qwik';
import { t } from '../../locale/labels';

interface selectInterface {
	id: string;
	label?: string;
	value: Signal<string>;
	options: Signal<string[]>;
	placeholder?: string;
	onChange$?: QRL;
}

export const Select = component$<selectInterface>(
	({ id, label, value, options, placeholder, onChange$ }) => {
		const closeDropdown = $(() => {
			const button = document.getElementById('select-button-' + id);
			button?.click();
		});

		const clearValue = $(() => {
			value.value = '';
			closeDropdown();
		});

		const updateValue = $((_value: string) => {
			value.value = _value;
			closeDropdown();
		});

		const updateMenuWidth = $(() => {
			const button = document.getElementById('select-button-' + id);
			const menu = document.getElementById('select-dropdown-' + id);
			if (menu !== null) menu.style.width = `${button?.offsetWidth}px`;
		});

		useVisibleTask$(({ track }) => {
			track(value);
			onChange$ && onChange$();
		});

		// Set menu width as initial button width
		useVisibleTask$(() => {
			setTimeout(updateMenuWidth, 600);
		});

		// Change menu width on resize page
		useVisibleTask$(({ cleanup }) => {
			window.addEventListener('resize', updateMenuWidth);
			cleanup(() => window.removeEventListener('resize', updateMenuWidth));
		});

		return (
			<form class='w-full md:max-w-[300px] lg:max-w-[300px]'>
				<label class='block text-sm font-normal text-dark-gray'>{label}</label>

				<button
					id={'select-button-' + id}
					data-dropdown-toggle={'select-dropdown-' + id}
					class='w-full bg-white border border-darkgray-500 text-gray-900 text-sm font-normal rounded-md block w-full p-2.5 inline-flex flex-row justify-between align-middle'
					type='button'
				>
					<span class={(!value.value && 'text-darkgray-500') + ' truncate'}>
						{value.value || placeholder}
					</span>
					<svg
						class='w-2.5 h-2.5 m-[5px] text-darkgray-700'
						aria-hidden='true'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 10 6'
					>
						<path
							stroke='currentColor'
							stroke-linecap='round'
							stroke-linejoin='round'
							stroke-width='2'
							d='m1 1 4 4 4-4'
						/>
					</svg>
				</button>

				{/* <!-- Dropdown menu --> */}
				<div
					id={'select-dropdown-' + id}
					class='z-10 hidden  md:max-w-[300px] lg:max-w-[300px] bg-white divide-y divide-gray-100 rounded-md shadow'
				>
					<ul
						class='max-h-96 overflow-y-auto py-2 text-sm text-gray-700'
						aria-labelledby='dropdownDefaultButton'
					>
						{options?.value.map((option, index) => (
							<li
								key={index}
								onClick$={() => {
									updateValue(option);
								}}
							>
								<a
									href='#'
									class='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
								>
									{option}
								</a>
							</li>
						))}
					</ul>
					{/* Select options */}
					{value.value && (
						<div
							class='px-4 py-2 flex flex-row hover:bg-gray-100 space-x-1 cursor-pointer'
							onClick$={() => clearValue()}
						>
							<svg
								class='w-3 h-3 my-[5px] text-clara-red'
								aria-hidden='true'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 10 18'
							>
								<path
									stroke='currentColor'
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
								/>
							</svg>
							<a href='#' class='block text-sm text-clara-red '>
								{t('clear_filter_label')}
							</a>
						</div>
					)}
				</div>
			</form>
		);
	}
);
