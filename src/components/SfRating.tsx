import { PropFunction, component$, useId } from '@builder.io/qwik';
import { SfIconStar } from './SfIconStar';
import { SfIconStarFilled } from './SfIconStarFilled';

export const SfRating = component$<{
	max: number;
	value: number;
	onClick$: PropFunction<(value: number) => void>;
}>(({ max = 5, value = 0, onClick$ }) => {
	const uniqueId = useId();

	return (
		<div class='inline-flex items-center text-warning-500 text-base'>
			{[...Array(value).keys()].map((value, i) => (
				<SfIconStarFilled
					key={`${uniqueId}-filled-${i}`}
					onClick$={() => onClick$(value + 1)}
				/>
			))}
			{[...Array(max - value).keys()].map((value, i) => (
				<SfIconStar
					key={`${uniqueId}-${i}`}
					onClick$={() => onClick$(value + 1)}
				/>
			))}
		</div>
	);
});
