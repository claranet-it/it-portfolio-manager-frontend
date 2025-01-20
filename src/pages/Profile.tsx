import { component$ } from '@builder.io/qwik';
import { usePermissionAccess } from 'src/hooks/usePermissionAccess';
import { SkillLegend } from '../components/SkillLegend';
import { SkillMatrix } from '../components/SkillMatrix';
import { BusinessCardGenerator } from '../components/BusinessCardGenerator';
import { UserProfileCard } from '../components/UserProfileCard';

export const Profile = component$(() => {
	const { usersOptions, userSelected, userIdSelected } = usePermissionAccess();

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

			<div class='mb-4 border-b border-gray-200 dark:border-gray-700'>
				<ul
					class='-mb-px flex flex-wrap text-center text-sm font-medium'
					id='default-tab'
					data-tabs-toggle='#default-tab-content'
					role='tablist'
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
							Skill Matrix
						</button>
					</li>
					<li class='me-2' role='presentation'>
						<button
							class='inline-block rounded-t-lg border-b-2 p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'
							id='business-card-tab'
							data-tabs-target='#business-card'
							type='button'
							role='tab'
							aria-controls='business-card'
							aria-selected='false'
						>
							Business Card Generator
						</button>
					</li>
				</ul>
			</div>

			<div id='default-tab-content'>
				<div
					class='hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-800'
					id='skill-matrix'
					role='tabpanel'
					aria-labelledby='skill-matrix-tab'
				>
					<SkillMatrix userSelected={userSelected} userIdSelected={userIdSelected} />
				</div>
				<div
					class='hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-800'
					id='business-card'
					role='tabpanel'
					aria-labelledby='business-card-tab'
				>
					<BusinessCardGenerator />
				</div>
			</div>
		</div>
	);
});
