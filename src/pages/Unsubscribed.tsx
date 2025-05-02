import { component$ } from '@builder.io/qwik';
import { Button } from 'src/components/Button';
import { getIcon } from 'src/components/icons';

export const Unsubscribed = component$(() => {
	return (
		<div>
			<header>
				<div class='items-center justify-center border-b border-b-darkgray-300 bg-white md:flex lg:flex'>
					<div class='px-6 py-4 sm:text-center [&_svg]:sm:inline'>
						{getIcon('BricklyRedLogo')}
					</div>
				</div>
			</header>

			<div class='flex w-full flex-col items-center justify-center gap-4 py-4'>
				<h2 class='text-xl font-bold text-darkgray-900'>You're unsubscribed</h2>

				<div>{getIcon('Sad')}</div>

				<div>We're so sorry to loose you</div>
				<div>
					<a href='https://www.brickly.me'>
						<Button>Back to Brickly!</Button>
					</a>
				</div>
			</div>
		</div>
	);
});
