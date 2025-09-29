import { $, component$, QRL, Signal, useComputed$, useContext } from '@builder.io/qwik';
import { UserProfile } from '@models/user';
import { AppContext } from 'src/app';
import { OptionDropdown } from 'src/components/form/OptionDropdown';
import { ToggleSwitch } from 'src/components/form/ToggleSwitch';
import { DownArrow } from 'src/components/icons/DownArrow';
import { t } from 'src/locale/labels';
import { getUserMe } from 'src/services/user';
import { getACLValues, roleHierarchy } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';
import { InfoCard } from '../InfoCard';

const roles: Record<Roles, string> = {
	USER: t('ROLE_USER'),
	TEAM_LEADER: t('ROLE_TEAM_LEADER'),
	ADMIN: t('ROLE_ADMIN'),
	SUPERADMIN: t('ROLE_SUPERADMIN'),
};

type Props = {
	userSig: Signal<UserProfile[]>;
	updateUserValues: QRL;
	updateUserVisibility: QRL;
};
export const CompanyUsers = component$<Props>(
	({ userSig, updateUserValues, updateUserVisibility }) => {
		console.log('Rendering CompanyUsers with users:', userSig.value);
		const appStore = useContext(AppContext);
		const userAcl = useComputed$(async () => getACLValues());

		const crewOptionsSig = useComputed$(async () => {
			const uniqueCrews = appStore.configuration.crews.map((crew) => crew.name);
			return uniqueCrews.sort((a, b) => a.localeCompare(b));
		});

		const loggedUserEmail = useComputed$(async () => {
			const user = await getUserMe();
			return user.email;
		});

		return (
			<>
				<div class='mb-2 flex w-full flex-row items-center justify-between'>
					<span class='text-2xl font-bold text-dark-grey lg:mt-2'>
						{t('USERS_LABEL')}
					</span>
				</div>
				<div class='justify-content flex w-1/2 flex-col place-content-evenly space-y-1 sm:w-full md:w-full'>
					{userSig.value
						.filter((user) => user.name !== '')
						.map((user) => {
							return {
								...user,
								role:
									user.role !== '' && user.role !== undefined
										? (user.role as Roles)
										: Roles.USER,
							};
						})
						.map((user, index) => {
							const userActive = !user.disabled;

							return (
								<div
									key={`company-user-${index}`}
									class={`flex items-start justify-between rounded-lg border border-darkgray-200 px-3 py-3 ${userActive ? '' : 'bg-dark-gray-50'}`}
								>
									<div class='flex items-center justify-center space-x-2'>
										<div class='flex flex-col'>
											<h2
												class={`text-xl font-bold ${userActive ? 'text-darkgray-900' : 'text-darkgray-400'}`}
											>
												{user.name}
											</h2>
											<h3
												class={`text-sm font-normal ${userActive ? 'text-darkgray-900' : 'text-darkgray-400'}`}
											>
												{user.email}
											</h3>
										</div>
									</div>
									<div class='ml-4 flex flex-row items-center gap-2 text-center'>
										<OptionDropdown
											id={`user-dropdown-${index}-crew`}
											icon={<DownArrow />}
											label={user.crew ?? t('USER_CREW_LABEL')}
											disabled={
												!userActive || user.email === loggedUserEmail.value
											}
											options={crewOptionsSig.value.map((crew) => ({
												value: crew,
												onChange: $(
													async () =>
														await updateUserValues(
															user,
															user.role!,
															crew
														)
												),
											}))}
										/>
										<OptionDropdown
											id={`user-dropdown-${index}-role`}
											icon={<DownArrow />}
											label={roles[user.role] ?? t('USER_ROLE_LABEL')}
											disabled={
												!userActive || user.email === loggedUserEmail.value
											}
											options={Object.entries(roles)
												.filter(
													([role, _]) =>
														roleHierarchy[userAcl.value.role] >=
														roleHierarchy[role as Roles]
												)
												.map(([role, name]) => ({
													value: name,
													onChange: $(
														async () =>
															await updateUserValues(
																user,
																role,
																user.crew
															)
													),
												}))}
										/>
										{user.email !== loggedUserEmail.value && (
											<ToggleSwitch
												key={`company-user-toggle-${user.id}`}
												isChecked={userActive}
												onChange$={async (active: boolean) =>
													await updateUserVisibility(user, active)
												}
											/>
										)}
									</div>
								</div>
							);
						})}
				</div>
				{userSig.value.length === 1 && (
					<InfoCard
						title={t('INFOCARD_TITLE_NO_USERS')}
						body={t('INFOCARD_BODY_NO_USERS')}
					/>
				)}
			</>
		);
	}
);
