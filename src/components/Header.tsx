import { component$, useContext } from '@builder.io/qwik';
import { AppContext } from '../app';
import { t } from '../locale/labels';

export const Header = component$(() => {
	const appStore = useContext(AppContext);

	return (
		<header>
			<div class='flex justify-between items-center bg-white border-b-2 border-red-600 '>
				<div class='py-4 pl-6 w-[300px]'>
					<img alt='Claranet logo' height='33' src='/logo.webp' width='160' />
				</div>
				<div class='text-3xl font-bold uppercase'>
					{appStore.route === 'PROFILE'
						? t('profile')
						: appStore.route === 'SEARCH'
						? t('search')
						: t('effort')}
				</div>
				<div class='pr-6 w-[300px] flex justify-end'>
					{appStore.route !== 'PROFILE' && (
						<button
							class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0 min-w-[100px]'
							onClick$={() => {
								appStore.route = 'PROFILE';
							}}
						>
							{t('profile')}
						</button>
					)}
					{appStore.route !== 'SEARCH' && (
						<button
							class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0 min-w-[100px]'
							onClick$={() => {
								appStore.route = 'SEARCH';
							}}
						>
							{t('search')}
						</button>
					)}
					{appStore.route !== 'EFFORT' && (
						<button
							class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0 min-w-[100px]'
							onClick$={() => {
								appStore.route = 'EFFORT';
							}}
						>
							{t('effort')}
						</button>
					)}
				</div>
			</div>
		</header>
	);
});
