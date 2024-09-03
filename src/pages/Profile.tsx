import { component$ } from '@builder.io/qwik';
import { SkillLegend } from '../components/SkillLegend';
import { SkillMatrix } from '../components/SkillMatrix';
import { UserProfileCard } from '../components/UserProfileCard';

export const Profile = component$(() => {
	return (
		<div class='w-full space-y-3 px-6 pt-2.5'>
			<div class='flex sm:flex-col sm:space-y-3 md:flex-row md:justify-between lg:flex-row lg:justify-between'>
				<UserProfileCard />

				<SkillLegend />
			</div>

			<SkillMatrix />
		</div>
	);
});
