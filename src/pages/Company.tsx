import { $, component$, useComputed$, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { UserProfile } from '@models/user';
import { CompanySettings } from 'src/components/company/CompanySettings';
import { CompanySkills } from 'src/components/company/CompanySkills';
import { CompanyUsers } from 'src/components/company/CompanyUsers';
import { Tabs } from 'src/components/Tabs';
import { useCompany } from 'src/hooks/useCompany';
import { useNotification } from 'src/hooks/useNotification';
import { t } from 'src/locale/labels';
import { getUserMe, getUserProfiles } from 'src/services/user';
import { Roles } from 'src/utils/constants';
import { generateIcon } from 'src/utils/image';

export const Company = component$(() => {
	const { addEvent } = useNotification();

	const {
		company,
		fetchCompany,
		updateCompanyLogo,
		user: userEdit,
		updateSkillVisibility,
	} = useCompany();

	const logoUrl = useSignal(company.value.image_url ?? generateIcon(company.value.id));

	const userSig = useSignal<UserProfile[]>([]);

	const loggedUserEmail = useComputed$(async () => {
		const user = await getUserMe();
		return user.email;
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

	const tabs = [
		{
			id: 'skills',
			label: 'Company skills',
			content: $(() => (
				<CompanySkills company={company} updateSkillVisibility={updateSkillVisibility} />
			)),
		},
		{
			id: 'users',
			label: 'Users',
			content: $(() => (
				<CompanyUsers
					userSig={userSig}
					loggedUserEmail={loggedUserEmail}
					updateUserValues={updateUserValues}
					updateUserVisibility={updateUserVisibility}
				/>
			)),
		},
		{
			id: 'settings',
			label: 'Settings',
			content: $(() => (
				<CompanySettings
					company={company}
					companyLogoModalState={companyLogoModalState}
					logoUrl={logoUrl}
				/>
			)),
		},
	];

	return (
		<div class='w-full space-y-3 px-6 pb-10 pt-2.5'>
			<Tabs tabs={tabs} defaultActiveTabId='skills' />
		</div>
	);
});
