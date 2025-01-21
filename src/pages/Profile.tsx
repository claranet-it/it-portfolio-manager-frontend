import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { usePermissionAccess } from 'src/hooks/usePermissionAccess';
import { SkillMatrix } from '../components/SkillMatrix';
import { BusinessCardGenerator } from '../components/BusinessCardGenerator';
import { UserProfileCard } from '../components/UserProfileCard';
import { t } from '../locale/labels';
import { UserMe } from '@models/user';
import { AUTH_USER_KEY, ITALY_COMPANY_ID } from 'src/utils/constants';
import { get } from 'src/utils/localStorage/localStorage';
import { Tabs } from 'src/components/Tabs';

export const Profile = component$(() => {
	const { usersOptions, userSelected, userIdSelected } = usePermissionAccess();
	const currentUser = useSignal<UserMe | undefined>(undefined);

	useTask$(async () => {
		currentUser.value = JSON.parse((await get(AUTH_USER_KEY)) || '') as UserMe;
	});

	const tabs = [
		{
			id: 'skill-matrix',
			label: t('skills'),
			content: $(() => (
				<SkillMatrix userSelected={userSelected} userIdSelected={userIdSelected} />
			)),
		},
		...(currentUser.value?.company === ITALY_COMPANY_ID
			? [
					{
						id: 'business-card',
						label: t('BUSINESS_CARD'),
						content: $(() => <BusinessCardGenerator />),
					},
				]
			: []),
	];

	return (
		<div class='w-full space-y-3 px-6 pb-10 pt-2.5'>
			<div class='flex sm:flex-col sm:space-y-3 md:flex-row md:justify-between lg:flex-row lg:justify-between'>
				<UserProfileCard
					userSelected={userSelected}
					usersOptions={usersOptions}
					userIdSelected={userIdSelected}
				/>
			</div>

			<Tabs tabs={tabs} defaultActiveTabId='skill-matrix' />
		</div>
	);
});
