import { JSXOutput, QRL, component$, useVisibleTask$ } from '@builder.io/qwik';
import { initFlowbite } from 'flowbite';
import { Button } from '../Button';

interface optionDropdownInterface {
	id: string;
	icon?: JSXOutput;
	label: string;
	options: { value: string; onChange: QRL; class?: string }[];
	hidden?: boolean;
	disabled?: boolean;
}

export const OptionDropdown = component$<optionDropdownInterface>(
	({ id, icon, label, options, hidden, disabled }) => {
		const buttonId = `dropdown-menu-icon-button-${id}`;
		const dropdownId = `dropdown-dots-${id}`;

		useVisibleTask$(() => {
			initFlowbite();
		});

		return (
			<form class={['relative w-full', hidden ? 'hidden' : 'block']}>
				<Button
					disabled={disabled}
					variant={'link'}
					id={buttonId}
					data-dropdown-toggle={dropdownId}
				>
					<span class='inline-flex items-start gap-1'>
						{icon}
						{label}
					</span>
				</Button>
				<div
					id={dropdownId}
					class='z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700'
				>
					<ul
						class='py-2 text-sm text-gray-700 dark:text-gray-200'
						aria-labelledby={buttonId}
					>
						{options.map((option, index) => (
							<li
								key={`${id}-dropdown-${index}`}
								class={`${option.class} block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
								onClick$={option.onChange}
							>
								{option.value}
							</li>
						))}
					</ul>
				</div>
			</form>
		);
	}
);
