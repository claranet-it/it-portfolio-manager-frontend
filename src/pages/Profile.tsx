import { component$ } from '@builder.io/qwik';
import { usePermissionAccess } from 'src/hooks/usePermissionAccess';
import { SkillLegend } from '../components/SkillLegend';
import { SkillMatrix } from '../components/SkillMatrix';
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

			<SkillMatrix userSelected={userSelected} userIdSelected={userIdSelected} />
		</div>
	);
});
