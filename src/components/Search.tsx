import {
	component$,
	useComputed$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import { getConfiguration, getSkills } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, removeCookie } from '../utils/cookie';
import { SkillFull } from '../utils/types';

export const Search = component$(() => {
	const appStore = useContext(AppContext);
	const crewSig = useSignal('');
	const skillSig = useSignal('');
	const uidSig = useSignal('');
	const originalSkillsSig = useSignal<SkillFull[]>([]);
	const sailorsSkillsSig = useComputed$<Record<string, SkillFull[]>>(() => {
		let skills = originalSkillsSig.value;
		const result: Record<string, SkillFull[]> = {};
		if (crewSig.value) {
			skills = skills.filter(
				(sk) =>
					crewSig.value &&
					sk.crew.toLowerCase().indexOf(crewSig.value.toLowerCase()) >= 0
			);
		}
		if (skillSig.value) {
			skills = skills.filter(
				(sk) =>
					sk.skill.toLowerCase().indexOf(skillSig.value.toLowerCase()) >= 0 &&
					sk.score > 0
			);
		}
		if (uidSig.value) {
			skills = skills.filter(
				(sk) => sk.uid.toLowerCase().indexOf(uidSig.value.toLowerCase()) >= 0
			);
		}
		skills
			.sort((a: SkillFull, b: SkillFull) => (a.uid > b.uid ? 1 : -1))
			.map((skill) => {
				result[skill.uid] = [...(result[skill.uid] || []), skill];
			});
		return result;
	});

	useTask$(async () => {
		if (!getCookie(COOKIE_TOKEN_KEY)) {
			appStore.route = 'AUTH';
		}

		if (!appStore.configuration.skills.length) {
			const configuration = await getConfiguration();
			if (!configuration) {
				removeCookie(COOKIE_TOKEN_KEY);
				appStore.route = 'AUTH';
			}
			appStore.configuration = await getConfiguration();
		}

		const skills = await getSkills();
		if (!skills) {
			removeCookie(COOKIE_TOKEN_KEY);
			appStore.route = 'AUTH';
		}

		originalSkillsSig.value = skills;
	});

	return (
		<div class='p-8'>
			Crew
			<input class='border-2' type='text' bind:value={crewSig} />
			<br />
			Skill
			<input class='border-2' type='text' bind:value={skillSig} />
			<br />
			Name
			<input class='border-2' type='text' bind:value={uidSig} />
			<br />
			<div class='flex flex-col'>
				{Object.entries(appStore.configuration.skills).map(
					([category, skills]) => {
						return (
							<div class='pt-4'>
								{category}
								<table class=''>
									<thead>
										<tr>
											<th class='border-2 border-red-200 w-[300px]'>
												{t('name')}
											</th>
											{skills.map((sk) => (
												<th class='border-2 border-red-200 w-[300px]'>{sk}</th>
											))}
										</tr>
									</thead>
									<tbody>
										{Object.entries(sailorsSkillsSig.value).map(
											([name, sailorSkills], key) => (
												<tr
													class={`${key % 2 === 0 ? 'bg-gray-300' : ''}`}
													key={key}
												>
													<td>{name}</td>
													{skills.map((skill) => (
														<td>
															{sailorSkills.find((sk) => sk.skill === skill)
																?.score || ''}
														</td>
													))}
												</tr>
											)
										)}
									</tbody>
								</table>
							</div>
						);
					}
				)}

				{/* </div>
			{Object.entries(sailorsSkillsSig.value).map(([uid, skills], key) => (
				<div class='flex flex-col border border-red-200 w-[300px]'>
					<div class='text-center py-2 border-b-2 border-red-200'>{uid}</div>
					{skills.map((skill: SkillFull) => (
						<div key={key}>
							{skill.skill} - {skill.score}
						</div>
					))}
				</div>
			))} */}
			</div>
		</div>
	);
});
