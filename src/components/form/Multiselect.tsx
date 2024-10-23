import {
	$,
	QRL,
	Signal,
	component$,
	useComputed$,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import { initFlowbite } from 'flowbite';
import { t } from '../../locale/labels';
import { getIcon } from '../icons';

export type GroupedValues = {
	key: string;
	values: string[];
};

interface multiSelectInterface {
	id: string;
	label?: string;
	value: Signal<string[]>;
	options: Signal<string[]>;
	multiLevel?: {
		label: string;
		options: Signal<GroupedValues[]>;
	}[];
	size?: 'm' | 'auto';
	placeholder?: string;
	onChange$?: QRL;
	disabled?: boolean;
	invalid?: boolean;
	hidden?: boolean;
	allowSelectAll?: boolean;
}

export const Multiselect = component$<multiSelectInterface>(
	({
		id,
		label,
		value,
		options,
		multiLevel,
		size,
		placeholder,
		onChange$,
		disabled,
		invalid,
		hidden,
		allowSelectAll,
	}) => {
		const buttonRef = useSignal<HTMLElement>();

		const closeDropdown = $(() => {
			buttonRef.value?.click();
		});

		const clearValue = $(() => {
			value.value = [];
			closeDropdown();
		});

		const updateValue = $((_value: string) => {
			if (value.value.includes(_value)) {
				value.value = [...value.value.filter((val) => val !== _value)];
			} else {
				value.value = [...value.value, _value];
			}
		});

		const selectAll = $(() => {
			if (value.value.length === options.value.length) {
				value.value = [];
			} else {
				value.value = options.value;
			}
		});

		const labelStyle = useComputed$(() => {
			if (disabled) return 'text-darkgray-400';

			return 'text-dark-gray';
		});

		const buttonStyle = useComputed$(() => {
			if (disabled) return 'bg-dark-gray-50 border-darkgray-300 text-darkgray-400';

			if (invalid) return 'bg-white border-red-500 text-red-900';

			return 'bg-white border-darkgray-500 text-gray-900';
		});

		const sizeStyle = useComputed$(() => {
			if (size === 'auto') return '';

			return 'md:max-w-[300px] lg:max-w-[300px]';
		});

		const updateMultiLevelValue = $((selectedValues: string[]) => {
			if (selectedValues.every((v) => value.value.includes(v))) {
				value.value = value.value.filter((val) => !selectedValues.includes(val));
			} else {
				value.value = [...value.value, ...selectedValues];
			}
		});

		useVisibleTask$(() => {
			initFlowbite();
		});

		useVisibleTask$(({ track }) => {
			track(() => value.value);

			onChange$ && onChange$(value.value);
		});

		useVisibleTask$(({ track }) => {
			track(() => options.value);

			value.value = value.value.filter((val) => options.value.includes(val));
		});

		return (
			<form class={['relative w-full', sizeStyle.value, hidden ? 'hidden' : 'block']}>
				<label class={`block text-sm font-normal ${labelStyle.value}`}>{label}</label>

				<button
					ref={buttonRef}
					id={'select-button_multiple_' + id}
					disabled={disabled}
					data-dropdown-toggle={'select-dropdown_multiple_' + id}
					class={[
						'inline-flex w-full flex-row justify-between rounded-md border p-2.5 align-middle text-sm font-normal',
						buttonStyle.value,
					]}
					type='button'
				>
					<span class={['truncate', value.value.length === 0 && 'text-darkgray-500']}>
						{value.value.join(', ') || placeholder}
					</span>
					{getIcon('Downarrow')}
				</button>

				{invalid && <p class='mt-1 text-xs text-red-500'>{t('REQUIRED_FIELD_LABEL')}</p>}

				{/* Dropdown menu */}
				<div
					id={'select-dropdown_multiple_' + id}
					class={'z-10 hidden w-full divide-y divide-gray-100 rounded-md bg-white shadow'}
				>
					{options.value.length !== 0 && allowSelectAll && (
						<div class='block px-4 py-2 hover:bg-gray-100' onClick$={() => selectAll()}>
							<input
								checked={value.value.length === options.value.length}
								id={'checkbox-select-all-' + label + '-' + options.value.length}
								type='checkbox'
								value=''
								class='h-4 w-4 rounded border-gray-300 bg-gray-100 text-clara-red focus:ring-2 focus:ring-clara-red'
							/>
							<label
								for={'checkbox-select-all-' + label + '-' + options.value.length}
								class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
							>
								{t('SELECT_ALL_LABEL')}
							</label>
						</div>
					)}
					{multiLevel &&
						multiLevel.map((item, index) => (
							<div>
								<button
									id='doubleDropdownButton'
									class='flex w-full flex-row px-4 py-2 hover:bg-gray-100'
									data-dropdown-toggle='doubleDropdown'
									data-dropdown-placement='right-start'
									type='button'
								>
									<input
										id={'multiLevel-' + index}
										checked={options.value.some((v) => value.value.includes(v))}
										disabled
										type='checkbox'
										class='h-4 w-4 rounded border-gray-300 bg-gray-100 text-clara-red/[0.5] focus:ring-2 focus:ring-clara-red'
									/>
									<label
										for={'multiLevel-' + index}
										class='ms-2 flex w-full flex-row justify-between text-sm font-medium text-gray-900 dark:text-gray-300'
									>
										{item.label}
										{getIcon('ArrowRight')}
									</label>
								</button>
								<div
									id='doubleDropdown'
									class='z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700'
								>
									<ul
										class='max-h-96 overflow-y-auto py-2 text-sm text-gray-700'
										aria-labelledby='doubleDropdownButton'
									>
										{item.options.value.map((option) => (
											<li>
												<div class='block px-4 py-2 hover:bg-gray-100'>
													<input
														id={
															'multiLevel-' + index + '-' + option.key
														}
														checked={option.values.every((v) =>
															value.value.includes(v)
														)}
														onChange$={() =>
															updateMultiLevelValue(option.values)
														}
														type='checkbox'
														class='h-4 w-4 rounded border-gray-300 bg-gray-100 text-clara-red focus:ring-2 focus:ring-clara-red'
													/>
													<label
														for={
															'multiLevel-' + index + '-' + option.key
														}
														class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
													>
														{option.key}
													</label>
												</div>
											</li>
										))}
									</ul>
								</div>
							</div>
						))}
					<ul class='max-h-96 overflow-y-auto py-2 text-sm text-gray-700'>
						{options?.value.map((option, index) => (
							<li
								key={
									'select-dropdown_multiple-' +
									option +
									'-' +
									value.value.includes(option)
										? 'includes'
										: 'not-includes'
								}
							>
								<div class='block px-4 py-2 hover:bg-gray-100'>
									<input
										onChange$={() => updateValue(option)}
										checked={value.value.includes(option)}
										id={'checkbox-item-' + option + '-' + index}
										type='checkbox'
										value=''
										class='h-4 w-4 rounded border-gray-300 bg-gray-100 text-clara-red focus:ring-2 focus:ring-clara-red'
									/>
									<label
										for={'checkbox-item-' + option + '-' + index}
										class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
									>
										{option}
									</label>
								</div>
							</li>
						))}
					</ul>
					{/* Clear value button */}
					{value.value && (
						<div
							class='flex cursor-pointer flex-row space-x-1 px-4 py-2 hover:bg-gray-100'
							onClick$={() => clearValue()}
						>
							<svg
								class='my-[5px] h-3 w-3 text-clara-red'
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
							<span class='block text-sm text-clara-red'>
								{t('clear_filter_label')}
							</span>
						</div>
					)}
				</div>
			</form>
		);
	}
);
