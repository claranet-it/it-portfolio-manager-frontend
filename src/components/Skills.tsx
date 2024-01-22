import { component$, useComputed$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { AppContext } from '../app';
import { getConfiguration, getSkills } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, removeCookie } from '../utils/cookie';
import { navigateTo } from '../utils/router';
import { SkillMatrix } from '../utils/types';
import { Filters } from './Filters';
import { SkillCard } from './SkillCard';

export const Skills = component$(() => {
	const appStore = useContext(AppContext);

	const selectedServiceLineSig = useSignal('');
	const selectedCrewSig = useSignal('');
	const selectedSkillSig = useSignal('');
	const selectedNameSig = useSignal('');

	const originalSkillMatrixSig = useSignal<SkillMatrix>([]);
	const filteredSkillMatrixSig = useComputed$<SkillMatrix>(() => {
		let result = originalSkillMatrixSig.value;
		if (selectedNameSig.value) {
			result = result.filter((sk) => {
				const name = Object.keys(sk)[0];
				return name.toLowerCase().indexOf(selectedNameSig.value.toLowerCase()) >= 0;
			});
		}
		if (selectedCrewSig.value) {
			result = result.filter((sk) => {
				const crew = Object.values(sk)[0].crew;
				return crew.toLowerCase().indexOf(selectedCrewSig.value.toLowerCase()) >= 0;
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
				return name.toLowerCase().indexOf(selectedNameSig.value.toLowerCase()) >= 0;
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
					skills: configurationSkills.filter((skill) => skill === selectedSkillSig.value),
				};
			})
			.filter(({ skills }) => skills.length > 0)
			.reduce(
				(result, row) => {
					const { serviceLine, skills } = row;

					result[serviceLine] = skills;
					return result;
				},
				{} as Record<string, string[]>
			);
	});

	useTask$(async () => {
		if (!getCookie(COOKIE_TOKEN_KEY)) {
			navigateTo('auth');
		}

		if (!Object.keys(appStore.configuration.skills).length) {
			const configuration = await getConfiguration();
			if (!configuration) {
				removeCookie(COOKIE_TOKEN_KEY);
				navigateTo('auth');
			}
			appStore.configuration = configuration;
		}

		const skills = await getSkills();
		if (!skills) {
			removeCookie(COOKIE_TOKEN_KEY);
			navigateTo('auth');
		}

		originalSkillMatrixSig.value = skills;
	});

	return (
		<div class='p-8'>
			<Filters
				selectedCrew={selectedCrewSig}
				selectedName={selectedNameSig}
				selectedServiceLine={selectedServiceLineSig}
				selectedSkill={selectedSkillSig}
			/>
			<div class='flex flex-col'>
				{Object.entries(tableStructure.value).map(([serviceLine, configurationSkills]) => {
					return !selectedServiceLineSig.value ||
						selectedServiceLineSig.value === serviceLine ? (
						<div class='pt-4'>
							<div class='w-full text-center text-3xl font-bold my-4'>
								{serviceLine}
							</div>
							<div class='flex flex-wrap justify-between'>
								{configurationSkills.map((skill, key) => (
									<SkillCard
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
				})}
			</div>
		</div>
	);
});
