import {
	$,
	component$,
	useComputed$,
	useContext,
	useSignal,
	useStore,
	useTask$,
} from '@builder.io/qwik';
import { CompanySkill } from '@models/company';
import { ModalState } from '@models/modalState';
import { UserProfile } from '@models/user';
import { AppContext } from 'src/app';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/form/Input';
import { OptionDropdown } from 'src/components/form/OptionDropdown';
import { ToggleSwitch } from 'src/components/form/ToggleSwitch';
import { getIcon } from 'src/components/icons';
import { DownArrow } from 'src/components/icons/DownArrow';
import { Modal } from 'src/components/modals/Modal';
import { useCompany } from 'src/hooks/useCompany';
import { useNotification } from 'src/hooks/useNotification';
import { t } from 'src/locale/labels';
import { getUserMe, getUserProfiles } from 'src/services/user';
import { getACLValues, roleHierarchy } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';

const roles: Record<Roles, string> = {
	USER: t('ROLE_USER'),
	TEAM_LEADER: t('ROLE_TEAM_LEADER'),
	ADMIN: t('ROLE_ADMIN'),
	SUPERADMIN: t('ROLE_SUPERADMIN'),
};

export const Company = component$(() => {
	const { addEvent } = useNotification();
	const appStore = useContext(AppContext);

	const {
		company,
		fetchCompany,
		updateCompanyLogo,
		user: userEdit,
		updateSkillVisibility,
	} = useCompany();

	const logoUrl = useSignal(company.value.image_url);

	const userSig = useSignal<UserProfile[]>([]);

	const loggedUserEmail = useComputed$(async () => {
		const user = await getUserMe();
		return user.email;
	});

	const userAcl = useComputed$(async () => getACLValues());

	const crewOptionsSig = useComputed$(async () => {
		const uniqueCrews = appStore.configuration.crews.map((crew) => crew.name);
		return uniqueCrews.sort((a, b) => a.localeCompare(b));
	});

	const companyLogoModalState = useStore<ModalState>({
		title: t('LOGO_LABEL'),
		onCancel$: $(() => {
			logoUrl.value = company.value.image_url;
		}),
		onConfirm$: $(async () => {
			if (await updateCompanyLogo(logoUrl.value)) {
				addEvent({
					type: 'success',
					message: t('COMPANY_LOGO_SUCCESSFULLY_UPDATED'),
					autoclose: true,
				});
			}
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	const skillSig = useComputed$(() =>
		company.value.skills.reduce(
			(acc, obj) => {
				if (!acc[obj.serviceLine]) {
					acc[obj.serviceLine] = [];
				}
				acc[obj.serviceLine].push(obj);
				return acc;
			},
			{} as Record<string, CompanySkill[]>
		)
	);

	const noCrewLeader = useComputed$(() => {
		const crewsWithoutTeamLeader = crewOptionsSig.value.filter(
			(crewName) =>
				!userSig.value.some(
					(user) => user.crew === crewName && user.role === Roles.TEAM_LEADER
				)
		);

		return crewsWithoutTeamLeader;
	});

	const handleTeamLeader = $(async (user: UserProfile, crew: string) => {
		const userCrew = crew;
		const prevCrewLeader = userSig.value.find(
			(user) => user.crew === userCrew && user.role === Roles.TEAM_LEADER
		);
		if (prevCrewLeader) {
			await userEdit.updateUser(prevCrewLeader.id, Roles.USER, prevCrewLeader.crew);
		}
		user.crew = userCrew;
		await userEdit.updateUser(user.id, Roles.TEAM_LEADER, crew);
		userSig.value = (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
	});

	const updateUserValues = $(async (user: UserProfile, role: string, crew: string) => {
		if (role === Roles.TEAM_LEADER) {
			await handleTeamLeader(user, crew);
		} else {
			await userEdit.updateUser(user.id, role, crew);
		}
		userSig.value = (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
	});

	const updateUserVisibility = $(async (user: UserProfile, visible: boolean) => {
		await userEdit.updateUserActivation(user.id, visible);
		userSig.value = (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
	});

	useTask$(async () => {
		await fetchCompany();
		userSig.value = (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
	});

	return (
		<>
			<div class='w-full space-y-3 px-6 pb-10 pt-2.5'>
				<div class='flex sm:flex-col sm:space-y-3 md:flex-row md:justify-between lg:flex-row lg:justify-between'>
					<div class='gap-3 p-0 md:inline-flex lg:inline-flex'>
						<div class='grid content-center text-center md:flex-none lg:flex-none'>
							<img
								src={company.value.image_url}
								alt={t('profile_picture')}
								class='aspect-squar h-auto w-20 rounded-full object-cover sm:m-auto'
							/>
						</div>
						<div class='pt-0 md:px-4 lg:px-4'>
							<h2 class={`text-4xl font-semibold text-dark-grey`}>
								{company.value.domain}
							</h2>
							<Button
								variant={'link'}
								size={'xsmall'}
								onClick$={() => (companyLogoModalState.isVisible = true)}
							>
								{t('LOGO_EDIT_LABEL')}
							</Button>
						</div>
					</div>
				</div>

				<div class='flex flex-col sm:space-y-4 md:flex-row md:space-x-5 lg:flex-row lg:space-x-5'>
					{/* SKILLS */}
					<div class='flex-1'>
						<div class='mb-2 flex w-full flex-row items-center justify-between'>
							<span class='text-2xl font-bold text-dark-grey sm:mt-2'>
								{t('COMPANY_SKILL_LABEL')}
							</span>
						</div>
						<div class='justify-content ml-2 flex flex-col place-content-evenly space-y-1'>
							{Object.entries(skillSig.value).map(([serviceLine, skills]) => {
								const serviceCheck = skills.some((skill) => skill.visible);

								return (
									<div key={`company-skill-${serviceLine}`} class='mb-4'>
										<div class='flex flex-row justify-between'>
											<h2 class='mb-2 text-xl font-bold text-darkgray-900'>
												{serviceLine}
											</h2>
											<div class='mr-3'>
												<ToggleSwitch
													key={`company-skill-toggle-${serviceLine}`}
													isChecked={serviceCheck}
													onChange$={(e: boolean) => {
														skills.forEach((skill) => {
															skill.visible = e;
														});
													}}
												/>
											</div>
										</div>
										{skills
											.sort((a, b) => a.name.localeCompare(b.name))
											.map((skill) => {
												return (
													<div
														key={`company-skill-${skill.id}`}
														class='mb-1 flex items-start justify-between rounded-lg border border-darkgray-200 px-3 py-3'
													>
														<div class='flex items-center justify-center space-x-2'>
															<span class='skill-icon text-2xl text-darkgray-900'>
																{getIcon(skill.name)}
															</span>

															<div class='flex flex-col'>
																<h2 class='text-xl font-bold text-darkgray-900'>
																	{skill.name}
																</h2>
																<h3 class='text-sm font-normal text-darkgray-900'>
																	{skill.serviceLine}
																</h3>
															</div>
														</div>
														<div class='ml-4 text-center'>
															<ToggleSwitch
																isChecked={skill.visible}
																onChange$={(e: boolean) =>
																	updateSkillVisibility(
																		skill.id,
																		e
																	)
																}
															/>
														</div>
													</div>
												);
											})}
									</div>
								);
							})}
						</div>
					</div>

					{/* USERS */}
					<div class='flex-1'>
						<div class='mb-2 flex w-full flex-row items-center justify-between'>
							<span class='text-2xl font-bold text-dark-grey sm:mt-2'>
								{t('USERS_LABEL')}
							</span>
							{noCrewLeader.value.length > 0 && (
								<span class='text-xl font-bold text-clara-red'>
									{t('CREW_WITH_NO_LEADER_MESSAGE')}
								</span>
							)}
						</div>
						<div class='justify-content flex flex-col place-content-evenly space-y-1'>
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
											{user.email !== loggedUserEmail.value && (
												<div class='ml-4 flex flex-row items-center gap-2 text-center'>
													<OptionDropdown
														id={`user-dropdown-${index}-crew`}
														icon={<DownArrow />}
														label={user.crew ?? t('USER_CREW_LABEL')}
														disabled={!userActive}
														options={crewOptionsSig.value.map(
															(crew) => ({
																value: crew,
																onChange: $(
																	async () =>
																		await updateUserValues(
																			user,
																			user.role!,
																			crew
																		)
																),
															})
														)}
													/>
													<OptionDropdown
														id={`user-dropdown-${index}-role`}
														icon={<DownArrow />}
														label={
															roles[user.role] ?? t('USER_ROLE_LABEL')
														}
														disabled={!userActive}
														options={Object.entries(roles)
															.filter(
																([role, _]) =>
																	roleHierarchy[
																		userAcl.value.role
																	] > roleHierarchy[role as Roles]
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
													<ToggleSwitch
														key={`company-user-toggle-${user.id}`}
														isChecked={userActive}
														onChange$={async (active: boolean) =>
															await updateUserVisibility(user, active)
														}
													/>
												</div>
											)}
										</div>
									);
								})}
						</div>
					</div>
				</div>
			</div>

			<Modal state={companyLogoModalState}>
				<form class='space-y-3'>
					<Input label={t('LOGO_URL_LABEL')} bindValue={logoUrl} />
				</form>
			</Modal>
		</>
	);
});
