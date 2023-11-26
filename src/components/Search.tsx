import {
	component$,
	useComputed$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { AppContext } from '../app';
import { getConfiguration, getSkills } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, removeCookie } from '../utils/cookie';
import { SkillMatrix } from '../utils/types';
import { SearchSkillCard } from './SearchSkillCard';

export const Search = component$(() => {
	const appStore = useContext(AppContext);

	const selectedServiceLineSig = useSignal('');
	const selectedCrewSig = useSignal('');
	const selectedSkillSig = useSignal('');
	const selectedNameSig = useSignal('');

	const serviceLinesSig = useComputed$(() =>
		Object.keys(appStore.configuration.skills)
	);

	const crewsSig = useComputed$(() => {
		const result = appStore.configuration.crews.filter(
			(crew) =>
				!selectedServiceLineSig.value ||
				crew.service_line === selectedServiceLineSig.value
		);
		return result;
	});
	const skillsSig = useComputed$(() => {
		const skills: string[] = selectedServiceLineSig.value
			? appStore.configuration.skills[selectedServiceLineSig.value]
			: Object.values(appStore.configuration.skills).reduce((result, value) => {
					result.push(...value);
					return result;
			  }, []);
		return skills;
	});

	const originalSkillMatrixSig = useSignal<SkillMatrix>([]);
	const filteredSkillMatrixSig = useComputed$<SkillMatrix>(() => {
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

	const tableStructure = useComputed$<Record<string, string[]>>(() => {
		const rawData = appStore.configuration.skills;

		if (!selectedSkillSig.value) {
			return rawData;
		}

		return Object.entries(rawData)
			.map(([serviceLine, configurationSkills]) => {
				return {
					serviceLine,
					skills: configurationSkills.filter(
						(skill) => skill === selectedSkillSig.value
					),
				};
			})
			.filter(({ skills }) => skills.length > 0)
			.reduce((result, row) => {
				const { serviceLine, skills } = row;

				result[serviceLine] = skills;
				return result;
			}, {} as Record<string, string[]>);
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
			<div class='w-full flex justify-around mb-4'>
				<div class='max-w-[200px]'>
					<span class='block'>Service Line</span>
					<select
						value={selectedServiceLineSig.value}
						onChange$={(e) => {
							selectedServiceLineSig.value = e.target.value;
							selectedCrewSig.value = '';
						}}
						class='border-2 border-black w-full h-8 mt-2'
					>
						<option value='' selected></option>
						{serviceLinesSig.value.map((sl) => (
							<option value={sl}>{sl}</option>
						))}
					</select>
				</div>
				<div class='max-w-[200px]'>
					<span class='block'>Crew</span>
					<select
						bind:value={selectedCrewSig}
						class='border-2 border-black w-full h-8 mt-2'
					>
						<option value='' selected></option>
						{crewsSig.value.map(({ name }) => (
							<option value={name}>{name}</option>
						))}
					</select>
				</div>
				<div class='max-w-[200px]'>
					<span class='block'>Skill</span>
					<select
						bind:value={selectedSkillSig}
						class='border-2 border-black w-full h-8 mt-2'
					>
						<option value='' selected></option>
						{skillsSig.value.map((sk) => (
							<option value={sk}>{sk}</option>
						))}
					</select>
				</div>
				<div class='max-w-[200px]'>
					<span class='block'>Name</span>
					<input
						class='border-2 border-black w-full h-8 mt-2'
						type='text'
						bind:value={selectedNameSig}
					/>
				</div>
			</div>
			<div class='flex flex-col'>
				{Object.entries(tableStructure.value).map(
					([serviceLine, configurationSkills]) => {
						return !selectedServiceLineSig.value ||
							selectedServiceLineSig.value === serviceLine ? (
							<div class='pt-4'>
								<div class='w-full text-center text-3xl font-bold my-4'>
									{serviceLine}
								</div>
								<div class='flex flex-wrap justify-between'>
									{configurationSkills.map((skill, key) => (
										<SearchSkillCard
											key={key}
											skill={skill}
											skillMatrix={filteredSkillMatrixSig}
										/>
									))}
								</div>
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
