import { component$ } from '@builder.io/qwik';

type Props = {
	size?: number;
};
export const Kotlin = component$(({ size = 32 }: Props) => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24'>
			<path
				fill='none'
				stroke='currentColor'
				stroke-linecap='round'
				stroke-linejoin='round'
				stroke-width='2'
				d='M20 20H4V4h16M4 20L20 4M4 12l8-8m0 8l8 8'
			/>
		</svg>
	);
});
