import { component$, QRL } from '@builder.io/qwik';

export type BadgeProps = {
	label: string;
	onClick?: QRL;
};

/* TODO: Aggiungere varianti */

export const Badge = component$<BadgeProps>(({ label, onClick }) => {
	return (
		<div
			onClick$={onClick}
			class='inline-block rounded-md bg-info px-3 py-1 text-sm text-success-dark hover:cursor-pointer hover:bg-info-light'
		>
			{label}
		</div>
	);
});
