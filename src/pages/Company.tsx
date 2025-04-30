import {
	$,
	component$,
	sync$,
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
import { CompanySettings } from 'src/components/company/CompanySettings';
import { CompanySkills } from 'src/components/company/CompanySkills';
import { CompanyUsers } from 'src/components/company/CompanyUsers';
import { getIcon } from 'src/components/icons';
import { Tabs } from 'src/components/Tabs';
import { useCompany } from 'src/hooks/useCompany';
import { useNotification } from 'src/hooks/useNotification';
import { t } from 'src/locale/labels';
import { getUserMe, getUserProfiles } from 'src/services/user';
import { getACLValues } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';
import { generateIcon } from 'src/utils/image';

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

	const logoUrl = useSignal(company.value.image_url ?? generateIcon(company.value.id));

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

	const skillSig = useComputed$(() => {
		const skillList = appStore.configuration.skills;

		return company.value.skills.reduce(
			(acc, obj) => {
				if (!acc[obj.serviceLine]) {
					acc[obj.serviceLine] = [];
				}
				acc[obj.serviceLine].push({
					...obj,
					description:
						skillList[obj.serviceLine].find((skill) => skill.name === obj.name)
							?.description ?? '',
				});
				return acc;
			},
			{} as Record<string, CompanySkill[]>
		);
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

	const getSkillIcon = sync$((serviceLine: string, skill: string) => {
		if (serviceLine.toLowerCase() === 'design') {
			return getIcon('Design');
		}

		if (serviceLine.toLowerCase() === 'softskill') {
			return getIcon('UserGroup');
		}

		return getIcon(skill);
	});

	useTask$(async () => {
		await fetchCompany();
		userSig.value = (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
	});

	const tabs = [
		{
			id: 'skills',
			label: 'Company skills',
			content: $(() => <CompanySkills />),
		},
		{
			id: 'users',
			label: 'Users',
			content: $(() => <CompanyUsers />),
		},
		{
			id: 'settings',
			label: 'Settings',
			content: $(() => <CompanySettings />),
		},
	];

	return (
		<div class='w-full space-y-3 px-6 pb-10 pt-2.5'>
			<Tabs tabs={tabs} defaultActiveTabId='skills' />
		</div>
	);
});
