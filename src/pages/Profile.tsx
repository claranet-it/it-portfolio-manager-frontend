import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { usePermissionAccess } from 'src/hooks/usePermissionAccess';
import { SkillLegend } from '../components/SkillLegend';
import { SkillMatrix } from '../components/SkillMatrix';
import { BusinessCardGenerator } from '../components/BusinessCardGenerator';
import { UserProfileCard } from '../components/UserProfileCard';
import { t } from '../locale/labels';
import { UserMe } from '@models/user';
import { AUTH_USER_KEY, ITALY_COMPANY_ID } from 'src/utils/constants';
import { get } from 'src/utils/localStorage/localStorage';

export const Profile = component$(() => {
	const { usersOptions, userSelected, userIdSelected } = usePermissionAccess();
	const currentUser = useSignal<UserMe | undefined>(undefined);

	useTask$(async () => {
		currentUser.value = JSON.parse((await get(AUTH_USER_KEY)) || '') as UserMe;
	});

	return (
		<div class='w-full space-y-3 px-6 pb-10 pt-2.5'>
			<div class='flex sm:flex-col sm:space-y-3 md:flex-row md:justify-between lg:flex-row lg:justify-between'>
				<UserProfileCard
					userSelected={userSelected}
					usersOptions={usersOptions}
					userIdSelected={userIdSelected}
				/>

				<SkillLegend />
			</div>

			<div class='mb-4 border-b border-gray-200'>
				<ul
					class='-mb-px flex flex-wrap text-center text-sm font-medium'
					id='default-tab'
					data-tabs-toggle='#default-tab-content'
					role='tablist'
					data-tabs-active-classes='text-gray-600 hover:text-gray-600 border-gray-600'
					data-tabs-inactive-classes='text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300'
				>
					<li class='me-2' role='presentation'>
						<button
							class='inline-block rounded-t-lg border-b-2 p-4'
							id='skill-matrix-tab'
							data-tabs-target='#skill-matrix'
							type='button'
							role='tab'
							aria-controls='skill-matrix'
							aria-selected='false'
						>
							{t('skills')}
						</button>
					</li>
					{currentUser.value && currentUser.value.company === ITALY_COMPANY_ID && (
						<li class='me-2' role='presentation'>
							<button
								class='inline-block rounded-t-lg border-b-2 p-4'
								id='business-card-tab'
								data-tabs-target='#business-card'
								type='button'
								role='tab'
								aria-controls='business-card'
								aria-selected='false'
							>
								{t('BUSINESS_CARD')}
							</button>
						</li>
					)}
				</ul>
			</div>

			<div id='default-tab-content'>
				<div
					class='hidden rounded-lg p-4'
					id='skill-matrix'
					role='tabpanel'
					aria-labelledby='skill-matrix-tab'
				>
					<SkillMatrix userSelected={userSelected} userIdSelected={userIdSelected} />
				</div>
				{currentUser.value && currentUser.value.company === ITALY_COMPANY_ID && (
					<div
						class='hidden rounded-lg p-4'
						id='business-card'
						role='tabpanel'
						aria-labelledby='business-card-tab'
					>
						<BusinessCardGenerator />
					</div>
				)}
			</div>
		</div>
	);
});
