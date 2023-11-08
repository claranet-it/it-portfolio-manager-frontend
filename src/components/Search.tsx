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
import { SkillMatrix } from '../utils/types';

export const Search = component$(() => {
	const appStore = useContext(AppContext);

	const selectedServiceLineSig = useSignal('');
	const selectedCrewSig = useSignal('');
	const selectedSkillSig = useSignal('');
	const selectedNameSig = useSignal('');

	const serviceLinesSig = useComputed$(() =>
		Object.keys(appStore.configuration.skills)
	);
	const crewsSig = useComputed$(() =>
		appStore.configuration.crews.filter(
			(crew) =>
				!selectedServiceLineSig.value ||
				crew.service_line === selectedServiceLineSig.value
		)
	);

	const originalSkillMatrixSig = useSignal<SkillMatrix>([]);
	const filteredSkillMatrixSig = useComputed$<SkillMatrix>(() => {
		console.log('result', originalSkillMatrixSig.value);
		let result = originalSkillMatrixSig.value;
		if (selectedNameSig.value) {
			result = result.filter((sk) => {
				const name = Object.keys(sk)[0];
				return (
					name.toLowerCase().indexOf(selectedNameSig.value.toLowerCase()) >= 0
				);
			});
		}
		if (selectedCrewSig.value) {
			result = result.filter((sk) => {
				const crew = Object.values(sk)[0].crew;
				return (
					crew.toLowerCase().indexOf(selectedCrewSig.value.toLowerCase()) >= 0
				);
			});
		}
		if (selectedSkillSig.value) {
			result = result.filter((sk) => {
				const skills = Object.values(sk)[0].skills;
				return skills[selectedSkillSig.value] > 0;
			});
		}

		if (selectedServiceLineSig.value) {
			result = result.filter((sk) => {
				const name = Object.keys(sk)[0];
				return (
					name.toLowerCase().indexOf(selectedNameSig.value.toLowerCase()) >= 0
				);
			});
		}
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

		originalSkillMatrixSig.value = skills;
	});

	return (
		<div class='p-8'>
			<span class='w-[300px] block'>Service Line</span>
			<select bind:value={selectedServiceLineSig} class='border-2 border-black'>
				<option value='' selected></option>
				{serviceLinesSig.value.map((sl) => (
					<option value={sl}>{sl}</option>
				))}
			</select>
			<br />
			<span class='w-[300px] block'>Crew</span>
			<select bind:value={selectedCrewSig} class='border-2 border-black'>
				<option value='' selected></option>
				{crewsSig.value.map(({ name }) => (
					<option value={name}>{name}</option>
				))}
			</select>
			<br />
			<span class='w-[300px] block'>Skill</span>
			<select bind:value={selectedSkillSig} class='border-2 border-black'>
				<option value='' selected></option>
				{Object.entries(appStore.configuration.skills).map(
					([_, configurationSkills]) =>
						configurationSkills.map((sk) => <option value={sk}>{sk}</option>)
				)}
			</select>
			<br />
			<span class='w-[300px] block'>Name</span>
			<input
				class='border-2 border-black'
				type='text'
				bind:value={selectedNameSig}
			/>
			<br />
			<div class='flex flex-col'>
				{Object.entries(appStore.configuration.skills).map(
					([serviceLine, configurationSkills]) => {
						return !selectedServiceLineSig.value ||
							selectedServiceLineSig.value === serviceLine ? (
							<div class='pt-4'>
								{serviceLine}
								<table class=''>
									<thead>
										<tr>
											<th class='border-2 border-red-200 w-[300px]'>
												{t('name')}
											</th>
											{configurationSkills.map((sk) => (
												<th class='border-2 border-red-200 w-[300px]'>{sk}</th>
											))}
										</tr>
									</thead>
									<tbody>
										{filteredSkillMatrixSig.value.map((skillMatrix, key) => {
											const [name, { skills: sailorSkills }] =
												Object.entries(skillMatrix)[0];
											return (
												<tr
													class={`${key % 2 === 0 ? 'bg-gray-300' : ''}`}
													key={key}
												>
													<td>{name}</td>
													{configurationSkills.map((skill) => (
														<td class='text-center'>
															{sailorSkills[skill] || ''}
														</td>
													))}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						) : (
							<></>
						);
					}
				)}
			</div>
		</div>
	);
});
