import { component$, JSXOutput, QRL } from '@builder.io/qwik';
import { Button } from './Button';

import { cva } from 'class-variance-authority';

const infoVariants = cva('flex w-[480px] flex-col items-center rounded-md bg-info  sm:w-full', {
	variants: {
		size: {
			default: 'p-6',
			small: 'p-2 ',
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

type InfoCardProps = {
	cta?: QRL;
	cta_label?: string;
	title?: string;
	body: JSXOutput;
	size?: 'default' | 'small';
};

export const InfoCard = component$<InfoCardProps>(({ cta, title, body, cta_label, size }) => {
	return (
		<div class='flex justify-center'>
			<div class={infoVariants({ size })}>
				{title && <h2 class='mb-4 text-xl font-semibold text-gray-800'>{title}</h2>}
				<div class='mb-2 text-center text-gray-600'>{body}</div>

				{cta && cta_label && (
					<Button variant='outline' onClick$={cta}>
						{cta_label}
					</Button>
				)}
			</div>
		</div>
	);
});
