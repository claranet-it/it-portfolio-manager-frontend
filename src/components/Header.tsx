import { component$ } from '@builder.io/qwik';
import { t } from '../locale/labels';
import { Route, navigateTo } from '../utils/router';

export const Header = component$<{ currentRoute: Route }>(
	({ currentRoute }) => {
		return (
			<header>
				<div class='flex justify-between items-center bg-white border-b-2 border-red-600 '>
					<div class='py-4 pl-6 w-[300px]'>
						<img alt='Claranet logo' height='33' src='/logo.webp' width='160' />
					</div>
					<div class='text-3xl font-bold uppercase'>
						{currentRoute === 'profile'
							? t('profile')
							: currentRoute === 'search'
							? t('search')
							: t('effort')}
					</div>
					<div class='pr-6 w-[300px] flex justify-end'>
						{currentRoute !== 'profile' && (
							<button
								class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0 min-w-[100px]'
								onClick$={() => {
									navigateTo('profile');
								}}
							>
								{t('profile')}
							</button>
						)}
						{currentRoute !== 'search' && (
							<button
								class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0 min-w-[100px]'
								onClick$={() => {
									navigateTo('search');
								}}
							>
								{t('search')}
							</button>
						)}
						{currentRoute !== 'effort' && (
							<button
								class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0 min-w-[100px]'
								onClick$={() => {
									navigateTo('effort');
								}}
							>
								{t('effort')}
							</button>
						)}
					</div>
				</div>
			</header>
		);
	}
);
