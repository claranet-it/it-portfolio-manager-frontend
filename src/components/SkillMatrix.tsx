import {
	$,
	component$,
	Signal,
	useComputed$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { Skill } from '@models/skill';
import { useCompany } from 'src/hooks/useCompany';
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
	const { company, fetchCompany } = useCompany();

	const skillSig = useSignal<Skill[]>([]);

	const fetchSkillMatrix = $(async () => {
		const userId = userIdSelected.value;
		skillSig.value = userId ? await getSkillMatrixUser(userId) : await getSkillMatrixMine();
	});

	const skillMatrixSig = useComputed$(async () => {
		const result: Record<string, Skill[]> = {};

		const activeSkills = company.value.skills
			.filter((skill) => skill.visible)
			.map((skill) => skill.name);

		const rawData: Record<string, string[]> = Object.fromEntries(
			Object.entries(appStore.configuration.skills)
				.map(([key, value]) => {
					return [key, value.filter((skill) => activeSkills.includes(skill))];
				})
				.filter(([_, value]) => value.length > 0)
		);

		Object.entries(rawData).forEach(([skillCategory, skills]) => {
			result[skillCategory] = [];
			skills.forEach((skill) => {
				const score = skillSig.value.find((s) => s.skill === skill)?.score || 0;
				result[skillCategory].push({ skill, score, skillCategory });
			});
		});
		return result;
	});

	const updateSkill = $(async (skill: Skill) => {
		if (userIdSelected.value) {
			await pathSkillMatrixUser(skill, userIdSelected.value);
		} else {
			await pathSkillMatrixMine(skill);
		}

		await fetchSkillMatrix();
	});

	useTask$(async ({ track }) => {
		track(() => userIdSelected.value);
		await Promise.all([fetchSkillMatrix(), fetchCompany()]);
	});

	return (
		<div
			key={`skillmatrix-${userIdSelected.value ?? 'mine'}`}
			class='sm: flex flex-col sm:space-y-4 md:flex-row md:space-x-5 lg:flex-row lg:space-x-5'
		>
			{Object.entries(skillMatrixSig.value).map(([category, skills], key) => (
				<div
					key={`skillmatrix-${userIdSelected.value ?? 'mine'}-${category}`}
					class='flex-1'
				>
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
								key={`${userIdSelected.value ?? 'mine'}-${category}-${key}`}
								skill={skill}
								onClick$={async (newScore) => {
									skill.score = newScore;
									await updateSkill(skill);
								}}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
});
