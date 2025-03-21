import { component$, JSXChildren, QRL } from '@builder.io/qwik';

export interface AccordionProps {
	cards: Card[];
	nested?: boolean;
	loading?: boolean;
}

interface Card {
	title?: string | JSXChildren;
	onTitleClick?: QRL<() => void>;
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
						class={`flex w-full items-center justify-between border border-gray-200 bg-surface-20 p-5 font-medium text-dark-grey rtl:text-right ${borderClass} gap-3 focus:ring-4 focus:ring-gray-200 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-800`}
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
			<div class={`${card.opened ? '' : 'hidden'} `}>
				<div
					class={`border p-5 ${isLast ? 'border-b-1' : 'border-b-0'} border-gray-200 dark:border-gray-700 dark:bg-gray-900`}
				>
					{card.body}
				</div>
			</div>
		</>
	);
};

export const Accordion = component$<AccordionProps>(({ cards, nested, loading }) => {
	return (
		<div id={`accordion-nested-parent`}>
			{loading ? (
				<div>
					<div
						class={`animating border-b-1 border border-gray-200 p-5 text-gray-400 dark:border-gray-700 dark:bg-gray-900`}
					>
						Loading
					</div>
				</div>
			) : (
				<>
					{cards.length !== 0 ? (
						cards.map((card, index) => (
							<AccordionCard
								card={card}
								index={index}
								total={cards.length}
								nested={nested}
							/>
						))
					) : (
						<div>
							<div
								class={`border-b-1 border border-gray-200 p-5 text-gray-400 dark:border-gray-700 dark:bg-gray-900`}
							>
								Empty
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
});
