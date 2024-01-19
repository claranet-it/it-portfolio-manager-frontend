import {
	$,
	component$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { AppContext } from '../app';
import {
	getSkillMatrixMine,
	pathSkillMatrixMine
} from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie } from '../utils/cookie';
import { navigateTo } from '../utils/router';
import { Skill } from '../utils/types';
import { SfIconStar } from './SfIconStar';
import { SfRating } from './SfRating';
import { getIcon } from './icons';

export const SkillMatrix = component$(() => {
	const appStore = useContext(AppContext);
	const skillsMineSig = useSignal<Record<string, Skill[]>>({});

	const loadSkillsMatrixMine = $(async () => {
		const skillMine = await getSkillMatrixMine();
		const result: Record<string, Skill[]> = {};
		Object.entries(appStore.configuration.skills).forEach(
			([skillCategory, skills]) => {
				result[skillCategory] = [];
				skills.forEach((skill) => {
					const score = skillMine.find((s) => s.skill === skill)?.score || 0;
					result[skillCategory].push({ skill, score, skillCategory });
				});
			}
		);
		return result;
	});

	useTask$(async () => {
		if (!getCookie(COOKIE_TOKEN_KEY)) {
			navigateTo('auth');
		}
		skillsMineSig.value = await loadSkillsMatrixMine();
	});

	return (
		<div>
			<div class='inline-flex items-center justify-center w-full my-2'>
				{Object.entries(appStore.configuration.scoreRangeLabels).map(
					([value, label], key) => (
						<div key={key} class='flex items-center mr-4'>
							{value === '0' ? (
								<div class='relative top-[0.5px]'>
									<SfIconStar />
								</div>
							) : (
								<SfRating max={Number(value)} value={Number(value)} />
							)}
							<span class='ml-1 relative top-[2px]'>{label}</span>
						</div>
					)
				)}
			</div>
			{Object.entries(skillsMineSig.value).map(([category, skills], key) => (
				<div key={key}>
					<div key={key} class='inline-flex items-center justify-center w-full'>
						<hr class='w-[400px] h-px my-8 py-0.5 bg-red-200 border-0' />
						<span class='absolute px-3 font-semibold text-black -translate-x-1/2 bg-red-200 left-1/2 min-w-[200px] text-center py-1'>
							{category}
						</span>
					</div>
					<div class='flex flex-wrap justify-content place-content-evenly pb-8'>
						{skills.map(({ skill, score, skillCategory }, key) => (
							<div
								key={key}
								class='flex items-start p-4 m-2 rounded-lg border border-red-200'
							>
								<div class='flex items-center justify-center bg-red-200 h-12 w-12 rounded-full border border-red-600'>
									{getIcon(skill)}
								</div>
								<div class='ml-4 text-center'>
									<h2 class='font-semibold'>{skill}</h2>
									<SfRating
										max={appStore.configuration.scoreRange.max}
										value={score}
										onClick$={async (newScore) => {
											await pathSkillMatrixMine({
												skill,
												skillCategory,
												score: newScore,
											});
											const newSkills = skillsMineSig.value;
											newSkills[category] = skillsMineSig.value[category].map(
												(s) => ({
													...s,
													score: s.skill === skill ? newScore : s.score,
												})
											);
											skillsMineSig.value = { ...newSkills };
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
});
