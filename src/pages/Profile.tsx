import { component$ } from '@builder.io/qwik';
import { SkillLegend } from '../components/SkillLegend';
import { SkillMatrix } from '../components/SkillMatrix';
import { UserProfileCard } from '../components/UserProfileCard';

export const Profile = component$(() => {
	return (
		<div class='w-full px-6 pt-2.5 space-y-3'>
			<div class='flex sm:flex-col md:flex-row lg:flex-row  sm:space-y-3 md:justify-between lg:justify-between'>
				<UserProfileCard />

				<SkillLegend />
			</div>

			<SkillMatrix />
		</div>
	);
});
