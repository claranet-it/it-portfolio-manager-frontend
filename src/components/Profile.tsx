import { component$ } from '@builder.io/qwik';
import { SkillLegend } from './SkillLegend';
import { UserProfileCard } from './UserProfileCard';

export const Profile = component$(() => {
	return (
		<div class='px-3 pt-2.5'>
			<div class='flex sm:flex-col md:flex-row lg:flex-row  sm:space-y-3 md:justify-between lg:justify-between'>
				<UserProfileCard />

				<SkillLegend />
			</div>

			{/* <SkillMatrix /> */}
		</div>
	);
});
