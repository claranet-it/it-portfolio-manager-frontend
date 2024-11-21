import { AUTH_CREW_KEY, AUTH_ROLE_KEY, Roles } from './constants';
import { get } from './localStorage/localStorage';

export const limitRoleAccess = async <T extends (...args: unknown[]) => unknown>(
	role: Roles,
	action?: T,
	...params: Parameters<T>
): Promise<boolean> => {
	const currentRole = ((await get(AUTH_ROLE_KEY)) as Roles) || Roles.USER;

	const roleHierarchy: Record<Roles, number> = {
		SUPERADMIN: 3,
		ADMIN: 2,
		TEAM_LEADER: 1,
		USER: 0,
	};

	const isAuthorized =
		currentRole === Roles.SUPERADMIN ||
		currentRole === role ||
		roleHierarchy[currentRole] >= roleHierarchy[role];

	if (isAuthorized && action) {
		action(...params);
	}

	return isAuthorized;
};

export const getACLValues = async () => {
	const role = ((await get(AUTH_ROLE_KEY)) as Roles) || Roles.USER;
	const crew = await get(AUTH_CREW_KEY);

	return {
		role,
		crew,
	};
};
