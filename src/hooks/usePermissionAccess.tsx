import { useComputed$, useSignal } from '@builder.io/qwik';
import { getUserProfiles } from 'src/services/user';
import { getACLValues } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';

export const usePermissionAccess = () => {
	const userSelected = useSignal('');

	const userAcl = useComputed$(async () => getACLValues());

	const usersSig = useComputed$(async () => {
		const users = await getUserProfiles();
		const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
		return sortedUsers.filter((user) =>
			userAcl.value.role === Roles.TEAM_LEADER ? user.crew === userAcl.value.crew : true
		);
	});

	const usersOptions = useComputed$(() => ['-', ...usersSig.value.map((user) => user.name)]);

	const userIdSelected = useComputed$(
		() =>
			usersSig.value.find((user) =>
				userSelected.value === '' || userSelected.value === '-'
					? false
					: user.name === userSelected.value
			)?.id
	);

	return {
		usersOptions,
		userSelected,
		userIdSelected,
	};
};
