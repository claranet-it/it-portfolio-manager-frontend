import { component$ } from '@builder.io/qwik';
import { Button } from 'src/components/Button';
import { getIcon } from 'src/components/icons';
import { t } from 'src/locale/labels';

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
				<h2 class='text-xl font-bold text-darkgray-900'>{t('UNSUBSCRIBED_TITLE')}</h2>

				<div>{getIcon('Sad')}</div>

				<div>{t('UNSUBSCRIBED_MESSAGE')}</div>
				<div>
					<a href='https://www.brickly.me'>
						<Button>{t('BACK_TO_HOMEPAGE')}</Button>
					</a>
				</div>
			</div>
		</div>
	);
});
