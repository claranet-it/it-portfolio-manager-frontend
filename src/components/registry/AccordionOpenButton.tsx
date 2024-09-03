import { QRL, Signal, component$ } from '@builder.io/qwik';

interface AccordionOpenButtonProps {
	onClick$: QRL;
	accordionState: Signal<Boolean>;
}

export const AccordionOpenButton = component$<AccordionOpenButtonProps>(
	({ onClick$, accordionState }) => {
		return (
			<button onClick$={onClick$}>
				<svg
					data-accordion-icon
					class={`h-3 w-3 ${accordionState.value ? '' : 'rotate-180'} shrink-0`}
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
						d='M9 5 5 1 1 5'
					/>
				</svg>
			</button>
		);
	}
);
