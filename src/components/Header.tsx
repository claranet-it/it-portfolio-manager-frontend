import { component$, useComputed$, useSignal } from '@builder.io/qwik';
import { useSnowEffect } from 'src/hooks/useSnowEffect';
import { limitRoleAccess } from 'src/utils/acl';
import { auth0 } from '../app';
import { Labels, t } from '../locale/labels';
import { navigateTo, Route } from '../router';
import { CHATBOT_COOKIE_KEY, Roles } from '../utils/constants';
import { removeCookie } from '../utils/cookie';
import { removeAuthToken } from '../utils/token';
import { Button } from './Button';
import { getIcon } from './icons';

type MenuRoutes = Exclude<Route, 'auth'>;

const redirect_uri = window.location.origin;

export const Header = component$<{ currentRoute: MenuRoutes }>(({ currentRoute }) => {
	const isSnowing = useSignal(true);
	const toggleSnow = useSnowEffect(isSnowing);

	const MENU = [
		'effort',
		'profile',
		'skills',
		'timesheet',
		'report',
		'search',
		'registry',
	] as const;

	const roleItems: Array<{ route: (typeof MENU)[number]; role?: Roles }> = [
		{
			route: 'effort',
		},
		{
			route: 'profile',
		},
		{
			route: 'skills',
		},
		{
			route: 'timesheet',
		},
		{
			route: 'report',
		},
		{
			route: 'search',
		},
		{
			route: 'registry',
			role: Roles.ADMIN,
		},
	];

	const menu = useComputed$(async () => {
		const filteredItems = await Promise.all(
			roleItems.map(async (item) => {
				const isAuthorized = await limitRoleAccess(item.role ?? Roles.USER);
				return isAuthorized ? item.route : '';
			})
		);

		return filteredItems;
	});

	return (
		<header>
			<div class='items-center justify-between border-b border-b-darkgray-300 bg-white md:flex lg:flex'>
				<div class='px-6 py-4 sm:text-center [&_svg]:sm:inline'>
					{getIcon('BricklyRedLogo')}
				</div>

				<div class='justify-end pr-6 sm:w-[100%] sm:text-center md:flex lg:flex'>
					{menu.value
						.filter((item) => item !== '')
						.map((section, key) => {
							const textColor =
								section === currentRoute ? 'text-darkgray-500' : 'text-clara-red';

							return (
								<button
									key={key}
									class={`bg-transparent ${textColor} m-2 min-w-[100px] rounded border-0 p-2 font-semibold hover:text-red-500`}
									onClick$={() => {
										navigateTo(section as Route);
									}}
								>
									{t(section as Labels)}
								</button>
							);
						})}
					<Button
						class='m-2 items-center rounded border-0 bg-transparent'
						onClick$={() => {
							isSnowing.value = !isSnowing.value;
							toggleSnow();
						}}
					>
						{!isSnowing.value ? getIcon('DarkSnow') : getIcon('Snow')}
					</Button>

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
