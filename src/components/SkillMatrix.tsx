import {
	$,
	component$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { AppContext } from '../app';
import {
	getConfiguration,
	getSkillMatrixMine,
	pathSkillMatrixMine,
} from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie } from '../utils/cookie';
import { SfRating } from './SfRating';
import { getIcon } from './icons';

export const SkillMatrix = component$(() => {
	const appStore = useContext(AppContext);
	const skillsSig = useSignal<Record<string, number>>({});

	const loadSkillsMatrixMine = $(async () => {
		const skillMatrixMine = await getSkillMatrixMine();
		return appStore.configuration.skills.reduce(
			(result: Record<string, number>, skill) => {
				result[skill] =
					skillMatrixMine.find((s) => s.skill === skill)?.score || 0;
				return result;
			},
			{}
		);
	});

	useTask$(async () => {
		if (!getCookie(COOKIE_TOKEN_KEY)) {
			appStore.isLogged = false;
		}
		if (!appStore.configuration.skills.length) {
			appStore.configuration = await getConfiguration();
		}
		skillsSig.value = await loadSkillsMatrixMine();
		console.log(skillsSig.value);
	});

	return (
		<div class='flex flex-wrap justify-content place-content-evenly pb-8'>
			{Object.entries(skillsSig.value).map(([skill, value], key) => (
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
							value={value}
							onClick$={async (score) => {
								skillsSig.value[skill] = score;
								skillsSig.value = { ...skillsSig.value };
								await pathSkillMatrixMine({ skill, score });
							}}
						/>
					</div>
				</div>
			))}
		</div>
	);
});
