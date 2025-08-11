import { component$ } from '@builder.io/qwik';

export type BadgeProps = {
	label: string;
};

/* TODO: Aggiungere varianti */

export const Badge = component$<BadgeProps>(({ label }) => {
	return (
		<div class='inline-block rounded-md bg-success-light px-3 py-1 text-sm text-success-dark'>
			{label}
		</div>
	);
});
