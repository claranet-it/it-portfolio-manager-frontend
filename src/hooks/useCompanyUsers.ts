import { $, useContext, useSignal } from '@builder.io/qwik';
import { UserProfile } from '@models/user';
import { AppContext } from 'src/app';
import { activateUser, deactivateUser, editUserProfile, getUserProfiles } from 'src/services/user';
import { Roles } from 'src/utils/constants';
import { useNotification } from './useNotification';

export const useCompanyUsers = () => {
	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const userSig = useSignal<UserProfile[]>([]);

	const fetchUsers = $(async () => {
		appStore.isLoading = true;
		userSig.value = (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
		appStore.isLoading = false;
	});

	const updateUser = $(async (userId: string, role: string, crew: string) => {
		appStore.isLoading = true;

		try {
			const actualRole = role === Roles.USER ? '' : role;
			await editUserProfile(userId, crew, actualRole);
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}

		appStore.isLoading = false;
	});

	const handleTeamLeader = $(async (user: UserProfile, crew: string) => {
		const userCrew = crew;
		const prevCrewLeader = userSig.value.find(
			(user) => user.crew === userCrew && user.role === Roles.TEAM_LEADER
		);
		if (prevCrewLeader) {
			await updateUser(prevCrewLeader.id, Roles.USER, prevCrewLeader.crew);
		}
		user.crew = userCrew;
		await updateUser(user.id, Roles.TEAM_LEADER, crew);
		userSig.value = (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
	});

	const updateUserActivation = $(async (userId: string, active: boolean) => {
		appStore.isLoading = true;

		try {
			if (active) {
				await activateUser(userId);
			} else {
				await deactivateUser(userId);
			}
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}

		appStore.isLoading = false;
	});

	const updateUserVisibility = $(async (user: UserProfile, visible: boolean) => {
		appStore.isLoading = true;
		await updateUserActivation(user.id, visible);
		await fetchUsers();
		appStore.isLoading = false;
	});

	const updateUserValues = $(async (user: UserProfile, role: string, crew: string) => {
		if (role === Roles.TEAM_LEADER) {
			await handleTeamLeader(user, crew);
		} else {
			await updateUser(user.id, role, crew);
		}
		userSig.value = (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
	});

	return {
		userSig,
		fetchUsers,
		updateUserValues,
		updateUserVisibility,
	};
};
