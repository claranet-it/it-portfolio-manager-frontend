import { component$ } from '@builder.io/qwik';
import { auth0 } from '../app';
import { t } from '../locale/labels';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { removeCookie } from '../utils/cookie';
import { Route, navigateTo } from '../utils/router';

type MenuRoutes = Exclude<Route, 'auth'>;

const MENU = ['profile', 'skills', 'effort', 'search'] as const;

const { VITE_AUTH_REDIRECT_URI: redirect_uri } = import.meta.env;

export const Header = component$<{ currentRoute: MenuRoutes }>(({ currentRoute }) => {
	return (
		<header>
			<div class='flex justify-between items-center bg-white border-b-2 border-red-600 '>
				<div class='py-4 pl-6 w-[300px]'>
					<img alt='Claranet logo' height='33' src='/logo.webp' width='160' />
				</div>
				<div class='text-3xl font-bold uppercase'>{t(currentRoute)}</div>
				<div class='pr-6 w-[300px] flex justify-end'>
					{MENU.filter((section) => currentRoute !== section).map((section, key) => (
						<button
							key={key}
							class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0 min-w-[100px]'
							onClick$={() => {
								navigateTo(section);
							}}
						>
							{t(section)}
						</button>
					))}
				</div>
				<div>
					<button
						class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0 min-w-[100px]'
						onClick$={() => {
							removeCookie(COOKIE_TOKEN_KEY);
							auth0.logout({
								logoutParams: {
									returnTo: redirect_uri,
								},
							});
						}}
					>
						Esci
					</button>
				</div>
			</div>
		</header>
	);
});
