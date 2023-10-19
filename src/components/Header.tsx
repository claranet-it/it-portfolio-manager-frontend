import { component$, useContext } from '@builder.io/qwik';
import { AppContext } from '../app';
import { t } from '../locale/labels';

export const Header = component$(() => {
	const appStore = useContext(AppContext);

	return (
		<header>
			<div class='flex justify-between items-center bg-white border-b-2 border-red-600 '>
				<div class='py-4 pl-6'>
					<img
						alt='Claranet logo'
						height='33'
						src='/public/logo.webp'
						width='160'
					/>
				</div>
				<div class='pr-6'>
					<button
						class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0'
						onClick$={() => {
							appStore.route = 'SEARCH';
						}}
					>
						{t('change_team')}
					</button>
				</div>
			</div>
		</header>
	);
});
