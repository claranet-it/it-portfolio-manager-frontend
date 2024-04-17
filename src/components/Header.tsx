import { component$ } from '@builder.io/qwik';
import { auth0 } from '../app';
import { t } from '../locale/labels';
import { Route, navigateTo } from '../router';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { removeCookie } from '../utils/cookie';
import { getIcon } from './icons';

type MenuRoutes = Exclude<Route, 'auth'>;

const MENU = ['effort', 'profile', 'skills', 'search'] as const;

const { VITE_AUTH_REDIRECT_URI: redirect_uri } = import.meta.env;

export const Header = component$<{ currentRoute: MenuRoutes }>(({ currentRoute }) => {
	return (
		<header>
			<div class='md:flex lg:flex justify-between items-center bg-white border-b border-b-darkgray-300 '>
				<div class='py-4 px-6 sm:text-center'>
					<img
						alt='Claranet logo'
						height='33'
						src='/logo.webp'
						width='160'
						class='sm:inline'
					/>
				</div>

				<div class='pr-6 sm:w-[100%] sm:text-center sm:text-center md:flex lg:flex justify-end'>
					{MENU.map((section, key) => {
						const textColor =
							section === currentRoute ? 'text-darkgray-500' : 'text-clara-red';
						return (
							<button
								key={key}
								class={`bg-transparent ${textColor} hover:text-red-500 font-semibold p-2 m-2 rounded border-0 min-w-[100px]`}
								onClick$={() => {
									navigateTo(section);
								}}
							>
								{t(section)}
							</button>
						);
					})}

					<button
						class='bg-transparent inline-flex items-center gap-2 text-dark-grey font-semibold p-2 m-2 rounded border-0 min-w-[100px]'
						onClick$={() => {
							auth0.logout({
								openUrl: () => {
									removeCookie(COOKIE_TOKEN_KEY);
									window.location.replace(redirect_uri)
								}
							});
						}}
					>
						{getIcon('Exit')} {t('logout')}
					</button>
				</div>
			</div>
		</header>
	);
});
