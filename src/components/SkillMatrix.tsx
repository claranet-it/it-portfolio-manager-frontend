import { $, component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { AppContext } from '../app';
import { tt } from '../locale/labels';
import { SkillRow } from './SkillRow';
import { getSkillMatrixMine, pathSkillMatrixMine } from '../services/skillMatrix';
import { Skill } from '@models/skill';

export const SkillMatrix = component$(() => {
	const appStore = useContext(AppContext);
	const skillsMineSig = useSignal<Record<string, Skill[]>>({});

	const loadSkillsMatrixMine = $(async () => {
		const skillMine = await getSkillMatrixMine();
		const result: Record<string, Skill[]> = {};
		Object.entries(appStore.configuration.skills).forEach(([skillCategory, skills]) => {
			result[skillCategory] = [];
			skills.forEach((skill) => {
				const score = skillMine.find((s) => s.skill === skill)?.score || 0;
				result[skillCategory].push({ skill, score, skillCategory });
			});
		});
		return result;
	});

	useTask$(async () => {
		skillsMineSig.value = await loadSkillsMatrixMine();
	});

	return (
		<div class='flex sm: flex-col md:flex-row lg:flex-row sm:space-y-4 md:space-x-5 lg:space-x-5'>
			{Object.entries(skillsMineSig.value).map(([category, skills], key) => (
				<div key={key} class='flex-1'>
					{/* title label area  */}
					<div key={key} class='items-center justify-center w-full mb-1'>
						<span class='text-2xl text-dark-grey font-bold sm:mt-2'>
							{tt('my_type_skill', { skillType: category })}
						</span>
					</div>
					{/* Skill list area  */}
					<div class='flex flex-col justify-content place-content-evenly space-y-1'>
						{skills.map((skill, key) => (
							<SkillRow
								key={key}
								skill={skill}
								onClick$={async (newScore) => {
									skill.score = newScore;
									await pathSkillMatrixMine(skill);
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
