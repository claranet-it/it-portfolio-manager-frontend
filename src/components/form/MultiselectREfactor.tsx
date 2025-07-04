import { QRL, Signal, component$, useComputed$, useVisibleTask$ } from '@builder.io/qwik';
import { initFlowbite } from 'flowbite';
import { t } from '../../locale/labels';
import { getIcon } from '../icons';
import { MultiselectDropdownMenu } from './MultiselectDropdownMenu';

export type GroupedOptions = {
	key: string;
	options: Option[];
};

export type Option = {
	id: string;
	name: string;
	group?: string;
};

interface multiSelectInterface {
	id: string;
	label?: string;
	selectedValues: Signal<Option[]>;
	options: Signal<Option[]>;
	multiLevel?: {
		label: string;
		options: Signal<GroupedOptions[]>;
	}[];
	size?: 'm' | 'auto';
	placeholder?: string;
	onChange$?: QRL;
	disabled?: boolean;
	invalid?: boolean;
	hidden?: boolean;
	allowSelectAll?: boolean;
}

export const MultiselectRefactor = component$<multiSelectInterface>(
	({
		id,
		label,
		selectedValues,
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

		useVisibleTask$(() => {
			initFlowbite();
		});

		useVisibleTask$(({ track }) => {
			track(() => selectedValues.value);

			onChange$ && onChange$(selectedValues.value);
		});

		useVisibleTask$(({ track }) => {
			track(() => options.value);

			selectedValues.value = selectedValues.value.filter((val) =>
				options.value.map((e) => e.id).includes(val.id)
			);
		});

		return (
			<form id={id} class={['relative w-full', sizeStyle.value, hidden ? 'hidden' : 'block']}>
				<label class={`block text-sm font-normal ${labelStyle.value}`}>{label}</label>

				<button
					id={'select-button_multiple_' + id}
					disabled={disabled}
					data-dropdown-toggle={'select-dropdown_multiple_' + id}
					class={[
						'inline-flex w-full flex-row justify-between rounded-md border p-2.5 align-middle text-sm font-normal',
						buttonStyle.value,
					]}
					type='button'
				>
					<span
						class={[
							'w-[90%]',
							'text-left',
							'truncate',
							selectedValues.value.length === 0 && 'text-darkgray-500',
						]}
					>
						{selectedValues.value.map((e) => e.name).join(', ') || placeholder}
					</span>
					{getIcon('Downarrow')}
				</button>

				{invalid && <p class='mt-1 text-xs text-red-500'>{t('REQUIRED_FIELD_LABEL')}</p>}

				{/* Dropdown menu */}
				<MultiselectDropdownMenu
					id={id}
					label={label}
					selectedValues={selectedValues}
					options={options}
					multiLevel={multiLevel}
					onChange$={onChange$}
					allowSelectAll={allowSelectAll}
				/>
			</form>
		);
	}
);
