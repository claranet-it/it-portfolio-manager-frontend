import { component$, JSXChildren } from '@builder.io/qwik';

export interface AccordionInterface {
	cards: Card[];
	nested?: boolean;
	loading?: boolean;
}

interface Card {
	title?: string | JSXChildren;
	onTitleClick?: () => void;
	body: JSXChildren;
	opened: boolean;
	disabled?: boolean;
}

const AccordionCard = ({
	card,
	index,
	total,
	nested = false,
}: {
	card: Card;
	index: number;
	total: number;
	nested?: boolean;
}) => {
	const isFirst = index === 0;
	const isLast = index === total - 1;
	const borderClass =
		isFirst && !nested
			? 'rounded-t-xl border-b-0'
			: isLast
				? 'border-t-1 border-b-1'
				: 'border-b-1';
	const hasTitle = card.title !== undefined;
	const iconClass = `w-3 h-3 shrink-0 ${card.opened ? '' : 'rotate-180'}`;

	return (
		<>
			{hasTitle && (
				<h2>
					<button
						type='button'
						class={`flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 ${borderClass} focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3`}
						aria-expanded={card.opened}
						onClick$={card.onTitleClick}
						disabled={card.disabled ?? false}
					>
						{typeof card.title === 'string' ? <span>{card.title}</span> : card.title}

						<svg
							class={iconClass}
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
				</h2>
			)}
			<div class={`${card.opened ? '' : 'hidden'}`}>
				<div
					class={`p-5 border ${isLast ? 'border-b-1' : 'border-b-0'} border-gray-200 dark:border-gray-700 dark:bg-gray-900`}
				>
					{card.body}
				</div>
			</div>
		</>
	);
};

export const Accordion = component$<AccordionInterface>(({ cards, nested, loading }) => {
	return (
		<div id={`accordion-nested-parent`}>
			{loading ? (
				<div>
					<div
						class={`animating p-5 border border-b-1 border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-400`}
					>
						Loading
					</div>
				</div>
			) : (
				<>
					{cards.map((card, index) => (
						<AccordionCard
							card={card}
							index={index}
							total={cards.length}
							nested={nested}
						/>
					))}
				</>
			)}
		</div>
	);
});
