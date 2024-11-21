import { $, component$, Signal, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { Skill } from '@models/skill';
import { AppContext } from '../app';
import { tt } from '../locale/labels';
import {
	getSkillMatrixMine,
	getSkillMatrixUser,
	pathSkillMatrixMine,
	pathSkillMatrixUser,
} from '../services/skillMatrix';
import { SkillRow } from './SkillRow';

interface SkillMatrixProps {
	userSelected: Signal<string>;
	userIdSelected: Readonly<Signal<string | undefined>>;
}

export const SkillMatrix = component$<SkillMatrixProps>(({ userIdSelected, userSelected }) => {
	const appStore = useContext(AppContext);
	const skillsMineSig = useSignal<Record<string, Skill[]>>({});

	const loadSkillsMatrix = $(async (userEmail?: string) => {
		let skillList: Skill[] = [];

		if (userEmail) {
			skillList = await getSkillMatrixUser(userEmail);
		} else {
			skillList = await getSkillMatrixMine();
		}

		const result: Record<string, Skill[]> = {};
		Object.entries(appStore.configuration.skills).forEach(([skillCategory, skills]) => {
			result[skillCategory] = [];
			skills.forEach((skill) => {
				const score = skillList.find((s) => s.skill === skill)?.score || 0;
				result[skillCategory].push({ skill, score, skillCategory });
			});
		});
		return result;
	});

	useTask$(async ({ track }) => {
		track(() => userIdSelected.value);

		skillsMineSig.value = await loadSkillsMatrix(userIdSelected.value);
	});

	return (
		<div
			key={`skillmatrix-${userIdSelected.value ?? 'mine'}`}
			class='sm: flex flex-col sm:space-y-4 md:flex-row md:space-x-5 lg:flex-row lg:space-x-5'
		>
			{Object.entries(skillsMineSig.value).map(([category, skills], key) => (
				<div key={key} class='flex-1'>
					{/* title label area  */}
					<div key={key} class='mb-1 w-full items-center justify-center'>
						<span class='text-2xl font-bold text-dark-grey sm:mt-2'>
							{userIdSelected.value
								? tt('user_type_skill', {
										user: userSelected.value,
										skillType: category,
									})
								: tt('my_type_skill', {
										skillType: category,
									})}
						</span>
					</div>
					{/* Skill list area  */}
					<div class='justify-content flex flex-col place-content-evenly space-y-1'>
						{skills.map((skill, key) => (
							<SkillRow
								key={key}
								skill={skill}
								onClick$={async (newScore) => {
									skill.score = newScore;
									if (userIdSelected.value) {
										await pathSkillMatrixUser(skill, userIdSelected.value);
									} else {
										await pathSkillMatrixMine(skill);
									}
									const newSkills = skillsMineSig.value;
									newSkills[category] = skillsMineSig.value[category].map(
										(s) => ({
											...s,
											score: s.skill === skill.skill ? newScore : s.score,
										})
									);
									skillsMineSig.value = { ...newSkills };
								}}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
});
