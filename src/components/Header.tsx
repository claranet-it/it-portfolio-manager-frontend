import { component$, useComputed$ } from '@builder.io/qwik';
import { limitRoleAccess } from 'src/utils/acl';
import { formatDateTime, isMaintenanceScheduled } from 'src/utils/maintenance';
import { auth0 } from '../app';
import { Labels, t } from '../locale/labels';
import { navigateTo, Route } from '../router';
import { CHATBOT_COOKIE_KEY, Roles } from '../utils/constants';
import { removeCookie } from '../utils/cookie';
import { removeAuthToken } from '../utils/token';
import { getIcon } from './icons';

type MenuRoutes = Exclude<Route, 'auth'>;

const redirect_uri = window.location.origin;

export const MENU = [
	'effort',
	'profile',
	'company',
	'networking',
	'skills',
	'timesheet',
	'report',
	'search',
	'registry',
] as const;

const roleBasedMenu: Array<{ route: (typeof MENU)[number]; role?: Roles }> = [
	{
		route: 'effort',
	},
	{
		route: 'profile',
	},
	{
		route: 'company',
		role: Roles.ADMIN,
	},
	{
		route: 'networking',
		role: Roles.ADMIN,
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
		role: Roles.ADMIN,
	},
	{
		route: 'registry',
		role: Roles.ADMIN,
	},
];

export const getRoleBasedMenu = () => {
	return roleBasedMenu.map((item) => {
		return {
			...item,
			role: item.role ?? Roles.USER,
		};
	});
};

const showMenu = (currentRoute: MenuRoutes) => {
	return currentRoute !== 'cipher';
};

export const Header = component$<{ currentRoute: MenuRoutes }>(({ currentRoute }) => {
	const startTime: number = Number(import.meta.env.VITE_MAINTENANCE_START);
	const endTime: number = Number(import.meta.env.VITE_MAINTENANCE_END);

	const menu = useComputed$(async () => {
		const filteredItems = await Promise.all(
			getRoleBasedMenu().map(async (item) => {
				const isAuthorized = await limitRoleAccess(item.role);
				return isAuthorized ? item.route : '';
			})
		);

		return filteredItems;
	});

	return (
		<header>
			{isMaintenanceScheduled() && (
				<div class='w-full border-b border-b-darkgray-300 bg-clara-red px-6 py-2 text-white'>
					<b>NOTICE:</b> Maintenance mode is scheduled from{' '}
					<b>{formatDateTime(startTime)}</b> to <b>{formatDateTime(endTime)}</b>
				</div>
			)}
			<div class='items-center justify-between border-b border-b-darkgray-300 bg-white md:flex lg:flex'>
				<div class='px-6 py-4 sm:text-center [&_svg]:sm:inline'>
					{getIcon('BricklyRedLogo')}
				</div>

				{showMenu(currentRoute) && (
					<div class='justify-end pr-6 sm:w-[100%] sm:text-center md:flex lg:flex'>
						{menu.value
							.filter((item) => item !== '')
							.map((section, key) => {
								const textColor =
									section === currentRoute
										? 'text-darkgray-500'
										: 'text-clara-red';

								return (
									<button
										key={key}
										class={`bg-transparent ${textColor} m-2 rounded border-0 p-2 font-semibold hover:text-red-500`}
										onClick$={() => {
											navigateTo(section as Route);
										}}
									>
										{t(section as Labels)}
									</button>
								);
							})}

						<button
							class='m-2 inline-flex items-center gap-2 rounded border-0 bg-transparent p-2 font-semibold text-dark-grey'
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
				)}
			</div>
		</header>
	);
});
