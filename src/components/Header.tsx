import { component$, useComputed$ } from '@builder.io/qwik';
import { limitRoleAccess } from 'src/utils/acl';
import { auth0 } from '../app';
import { t } from '../locale/labels';
import { navigateTo, Route } from '../router';
import { CHATBOT_COOKIE_KEY, Roles } from '../utils/constants';
import { removeCookie } from '../utils/cookie';
import { removeAuthToken } from '../utils/token';
import { getIcon } from './icons';

type MenuRoutes = Exclude<Route, 'auth'>;

const redirect_uri = window.location.origin;

export const Header = component$<{ currentRoute: MenuRoutes }>(({ currentRoute }) => {
	const isAdmin = useComputed$(async () => await limitRoleAccess(Roles.ADMIN));

	const MENU = [
		'effort',
		'profile',
		'skills',
		'timesheet',
		'report',
		'search',
		isAdmin.value ? 'registry' : '',
	] as const;

	return (
		<header>
			<div class='items-center justify-between border-b border-b-darkgray-300 bg-white md:flex lg:flex'>
				<div class='px-6 py-4 sm:text-center [&_svg]:sm:inline'>
					{getIcon('BricklyRedLogo')}
				</div>

				<div class='justify-end pr-6 sm:w-[100%] sm:text-center md:flex lg:flex'>
					{MENU.filter((v) => v !== '').map((section, key) => {
						const textColor =
							section === currentRoute ? 'text-darkgray-500' : 'text-clara-red';
						return (
							<button
								key={key}
								class={`bg-transparent ${textColor} m-2 min-w-[100px] rounded border-0 p-2 font-semibold hover:text-red-500`}
								onClick$={() => {
									navigateTo(section);
								}}
							>
								{t(section)}
							</button>
						);
					})}

					<button
						class='m-2 inline-flex min-w-[100px] items-center gap-2 rounded border-0 bg-transparent p-2 font-semibold text-dark-grey'
						onClick$={() => {
							auth0.logout({
								openUrl: async () => {
									removeCookie(CHATBOT_COOKIE_KEY);
									await removeAuthToken();
									window.location.replace(redirect_uri);
								},
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
