import { component$, JSXOutput, QRL } from '@builder.io/qwik';
import { Button } from './Button';

type InfoCardProps = {
	cta?: QRL;
	cta_label?: string;
	title: string;
	body: JSXOutput;
};

export const InfoCard = component$<InfoCardProps>(({ cta, title, body, cta_label }) => {
	return (
		<div class='flex justify-center'>
			<div class='flex w-[480px] flex-col items-center rounded-md bg-info p-6 sm:w-full'>
				<h2 class='mb-4 text-xl font-semibold text-gray-800'>{title}</h2>
				<div class='mb-6 text-gray-600'>{body}</div>

				{cta && cta_label && (
					<Button variant='outline' onClick$={cta}>
						{cta_label}
					</Button>
				)}
			</div>
		</div>
	);
});
