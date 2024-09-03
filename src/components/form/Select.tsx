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

interface selectInterface {
	id: string;
	label?: string;
	value: Signal<string>;
	options: Signal<string[]>;
	size?: 'm' | 'auto';
	placeholder?: string;
	onChange$?: QRL;
	disabled?: boolean;
	invalid?: boolean;
	hidden?: boolean;
}

export const Select = component$<selectInterface>(
	({ id, label, value, options, size, placeholder, onChange$, disabled, invalid, hidden }) => {
		const buttonRef = useSignal<HTMLElement>();

		const closeDropdown = $(() => {
			buttonRef.value?.click();
		});

		const clearValue = $(() => {
			value.value = '';
			closeDropdown();
		});

		const updateValue = $((_value: string) => {
			value.value = _value;
			closeDropdown();
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

		useVisibleTask$(({ track }) => {
			track(value);
			onChange$ && onChange$(value.value);
		});

		useVisibleTask$(() => {
			initFlowbite();
		});

		return (
			<form class={['relative w-full', sizeStyle.value, hidden ? 'hidden' : 'block']}>
				<label class={`block text-sm font-normal ${labelStyle.value}`}>{label}</label>

				<button
					ref={buttonRef}
					id={'select-button-' + id}
					disabled={disabled}
					data-dropdown-toggle={'select-dropdown-' + id}
					class={[
						'inline-flex w-full flex-row justify-between rounded-md border p-2.5 align-middle text-sm font-normal',
						buttonStyle.value,
					]}
					type='button'
				>
					<span class={['truncate', !value.value && 'text-darkgray-500']}>
						{value.value || placeholder}
					</span>
					<svg
						class='text-darkgray-700 m-[5px] h-2.5 w-2.5'
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

				{invalid && <p class='mt-1 text-xs text-red-500'>{t('REQUIRED_FIELD_LABEL')}</p>}

				{/* Dropdown menu */}
				<div
					id={'select-dropdown-' + id}
					class={'z-10 hidden w-full divide-y divide-gray-100 rounded-md bg-white shadow'}
				>
					<ul class='max-h-96 overflow-y-auto py-2 text-sm text-gray-700'>
						{options?.value.map((option, index) => (
							<li
								key={index}
								onClick$={() => {
									updateValue(option);
								}}
							>
								<span class='block px-4 py-2 hover:bg-gray-100'>{option}</span>
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
