import { Signal, component$, useVisibleTask$ } from '@builder.io/qwik';
import { initFlowbite } from 'flowbite';
import { Button } from '../Button';
import { getIcon } from '../icons';

export enum ToggleState {
	Off = 'Off',
	Intermediate = 'Intermediate',
	On = 'On',
}

interface radioDropdownInterface {
	id: string;
	label: string;
	value: Signal<ToggleState>;
	options: { title: string; body: string; value: ToggleState }[];
	hidden?: boolean;
}

export const RadioDropdown = component$<radioDropdownInterface>(
	({ id, label, value, options, hidden }) => {
		const buttonId = `dropdown-radio-button-${id}`;
		const dropdownId = `dropdown-radio-${id}`;

		useVisibleTask$(() => {
			initFlowbite();
		});

		return (
			<form class={['relative', hidden ? 'hidden' : 'block']}>
				<Button variant={'primary'} id={buttonId} data-dropdown-toggle={dropdownId}>
					<span class='inline-flex items-center justify-between gap-1'>
						{label}
						{getIcon('Downarrow')}
					</span>
				</Button>

				<div
					id={dropdownId}
					class='z-10 hidden w-60 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700'
					data-popper-reference-hidden=''
					data-popper-escaped=''
					data-popper-placement='top'
					style='position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(522.5px, 6119.5px, 0px);'
				>
					<ul
						class='space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200'
						aria-labelledby={buttonId}
					>
						{options.map((option) => (
							<li
								key={`${id}-${option.value}`}
								onClick$={() => (value.value = option.value)}
							>
								<div class='flex rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600'>
									<div class='flex h-5 items-center'>
										<input
											checked={value.value === option.value}
											id={`${id}-helper-radio-${option.value}`}
											name='helper-radio'
											type='radio'
											value=''
											class='h-4 w-4 border-gray-300 bg-gray-100 text-clara-red focus:ring-clara-red'
										/>
									</div>
									<div class='ms-2 text-sm'>
										<label
											for={`${id}-helper-radio-${option.value}`}
											class='font-medium text-gray-900 dark:text-gray-300'
										>
											<div>{option.title}</div>
											<p
												id={`${id}-helper-radio-text-${option.value}`}
												class='text-xs font-normal text-gray-500'
											>
												{option.body}
											</p>
										</label>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</form>
		);
	}
);
