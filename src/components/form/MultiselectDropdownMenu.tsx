import {
	$,
	QRL,
	Signal,
	component$,
	useComputed$,
	useSignal,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { initFlowbite } from 'flowbite';
import { t } from '../../locale/labels';
import { getIcon } from '../icons';
import { SearchInput } from './SearchInput';

export type GroupedOptions = {
	key: string;
	options: Option[];
};

export type Option = {
	id: string;
	name: string;
	group?: string;
};

type MultiselectDropdownMenuProps = {
	id: string;
	label?: string;
	selectedValues: Signal<Option[]>;
	options: Signal<Option[]>;
	multiLevel?: {
		label: string;
		options: Signal<GroupedOptions[]>;
	}[];
	onChange$?: QRL;
	allowSelectAll?: boolean;
};

export const MultiselectDropdownMenu = component$<MultiselectDropdownMenuProps>(
	({ id, label, selectedValues, options, multiLevel, onChange$, allowSelectAll }) => {
		const optionsFiltered = useSignal(options.value);
		const filterOptionString = useSignal<string>();

		const dropdownShow = useStore(() => {
			if (multiLevel) {
				const map: Record<string, boolean> = multiLevel.reduce(
					(map, item) => {
						map[item.label] = false;
						return map;
					},
					{} as Record<string, boolean>
				);
				return map;
			}
			return {} as Record<string, boolean>;
		});

		const convertToGroup = useComputed$(() => {
			const map: Record<string, Option[]> = optionsFiltered.value.reduce(
				(map, option) => {
					if (option.group) {
						if (!map[option.group]) {
							map[option.group] = [];
						}
						map[option.group].push(option);
					} else {
						if (!map['generico']) {
							map['generico'] = [];
						}
						map['generico'].push(option);
					}
					return map;
				},
				{} as Record<string, Option[]>
			);

			const mapped: { groupKey: string; groupOptions: Option[] }[] = Object.keys(map).map(
				(name) => ({
					groupKey: name,
					groupOptions: map[name],
				})
			);

			return mapped;
		});

		const filterSearch = $((searchString: string) => {
			optionsFiltered.value = options.value.filter((element) =>
				element.name.toLowerCase().includes(searchString.toLowerCase())
			);
		});

		const clearValue = $(() => {
			selectedValues.value = [];
		});

		const selectAll = $(() => {
			if (selectedValues.value.length === options.value.length) {
				selectedValues.value = [];
			} else {
				selectedValues.value = options.value;
			}
		});

		const updateValue = $((_value: Option) => {
			if (selectedValues.value.map((e) => e.id).includes(_value.id)) {
				selectedValues.value = [
					...selectedValues.value.filter((val) => val.id !== _value.id),
				];
			} else {
				selectedValues.value = [...selectedValues.value, _value];
			}
		});

		const updateMultiLevelValue = $((values: Option[]) => {
			if (values.every((v) => selectedValues.value.map((e) => e.id).includes(v.id))) {
				selectedValues.value = selectedValues.value.filter(
					(val) => !values.map((e) => e.id).includes(val.id)
				);
			} else {
				selectedValues.value = selectedValues.value.filter(
					(val) => !values.map((e) => e.id).includes(val.id)
				);
				selectedValues.value = [...selectedValues.value, ...values];
			}
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
			<div
				id={'select-dropdown_multiple_' + id}
				class={'z-10 hidden w-full divide-y divide-gray-100 rounded-md bg-white shadow'}
			>
				<div class='px-4'>
					<SearchInput value={filterOptionString} callback={filterSearch} />
				</div>

				{options.value.length !== 0 && allowSelectAll && (
					<div class='block px-4 py-2 hover:bg-gray-100' onClick$={() => selectAll()}>
						<input
							checked={selectedValues.value.length === options.value.length}
							id={'checkbox-select-all-' + label + '-' + options.value.length}
							type='checkbox'
							value=''
							class='h-4 w-4 rounded border-gray-300 bg-gray-100 text-clara-red focus:ring-2 focus:ring-clara-red'
						/>
						<label class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
							{t('SELECT_ALL_LABEL')}
						</label>
					</div>
				)}
				{multiLevel &&
					multiLevel.map((item, index) => (
						<>
							<button
								class='flex w-full flex-row px-4 py-2 hover:bg-gray-100'
								type='button'
								onClick$={() =>
									(dropdownShow[item.label] = !dropdownShow[item.label])
								}
							>
								<label class='ms-2 flex w-full flex-row justify-between text-sm font-medium text-gray-900 dark:text-gray-300'>
									{item.label}
									{getIcon('Downarrow')}
								</label>
							</button>

							{dropdownShow[item.label] && (
								<ul
									class='max-h-96 overflow-y-auto py-2 text-sm text-gray-700'
									aria-labelledby='doubleDropdownButton'
								>
									{item.options.value.map((option) => (
										<li>
											<div class='block px-4 py-2 hover:bg-gray-100'>
												<input
													id={'multiLevel-' + index + '-' + option.key}
													checked={option.options.every((v) =>
														selectedValues.value
															.map((e) => e.id)
															.includes(v.id)
													)}
													onChange$={() =>
														updateMultiLevelValue(option.options)
													}
													type='checkbox'
													class='h-4 w-4 rounded border-gray-300 bg-gray-100 text-clara-red focus:ring-2 focus:ring-clara-red'
												/>
												<label
													for={'multiLevel-' + index + '-' + option.key}
													class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
												>
													{option.key}
												</label>
											</div>
										</li>
									))}
								</ul>
							)}
						</>
					))}
				<ul class='max-h-96 overflow-y-auto py-2 text-sm text-gray-700'>
					{convertToGroup?.value.map((group, index) => {
						return (
							<>
								{convertToGroup?.value.length > 1 && (
									<li
										key={
											'select-dropdown_multiple-' +
											group.groupKey +
											'-group-' +
											index
										}
										class='block border-b-2 border-gray-100 px-4 py-2 text-sm font-bold'
									>
										{group.groupKey}
									</li>
								)}
								{group.groupOptions.map((option, index) => {
									return (
										<li
											key={
												'select-dropdown_multiple-' +
												option.id +
												'-' +
												selectedValues.value
													.map((e) => e.id)
													.includes(option.id)
													? 'includes'
													: 'not-includes'
											}
										>
											<div class='block px-4 py-2 hover:bg-gray-100'>
												<input
													onChange$={() => updateValue(option)}
													checked={selectedValues.value
														.map((e) => e.id)
														.includes(option.id)}
													id={'checkbox-item-' + option.id + '-' + index}
													type='checkbox'
													value=''
													class='h-4 w-4 rounded border-gray-300 bg-gray-100 text-clara-red focus:ring-2 focus:ring-clara-red'
												/>
												<label
													for={'checkbox-item-' + option.id + '-' + index}
													class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
												>
													{option.name}
												</label>
											</div>
										</li>
									);
								})}
							</>
						);
					})}
				</ul>
				{/* Clear value button */}
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
					<span class='block text-sm text-clara-red'>{t('clear_filter_label')}</span>
				</div>
			</div>
		);
	}
);
