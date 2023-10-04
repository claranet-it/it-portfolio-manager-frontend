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
			{[...Array(max).keys()].map((num, i) => {
				const currentValue = num + 1;
				return (
					<div>
						{currentValue > value ? (
							<SfIconStar
								key={`${uniqueId}-${i}`}
								onClick$={() => onClick$(currentValue)}
							/>
						) : (
							<SfIconStarFilled
								key={`${uniqueId}-filled-${i}`}
								onClick$={() => onClick$(0)}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
});
