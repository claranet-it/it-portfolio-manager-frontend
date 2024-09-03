import { component$, useComputed$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { SkillMatrix } from '@models/skill';
import { getSkillScore } from 'src/utils/skill';
import { AppContext } from '../app';
import { Filters } from '../components/Filters';
import { SkillCard } from '../components/SkillCard';
import { SkillLegend } from '../components/SkillLegend';
import { t, tt } from '../locale/labels';
import { getConfiguration } from '../services/configuration';
import { getSkills } from '../services/skillMatrix';

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
				return crew?.toLowerCase().indexOf(selectedCrewSig.value.toLowerCase()) >= 0;
			});
		}
		if (selectedSkillSig.value) {
			result = result.filter((sk) => {
				const skillItem = Object.values(sk)[0];
				const score = getSkillScore(skillItem, selectedSkillSig.value);
				return score > 0;
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
		if (!Object.keys(appStore.configuration.skills).length) {
			const configuration = await getConfiguration();
			appStore.configuration = configuration;
		}

		const skills = await getSkills();
		originalSkillMatrixSig.value = skills;
	});

	return (
		<div class='w-full flex-col space-y-6 px-6 pt-5'>
			<div class='flex sm:flex-col sm:space-y-1 md:flex-row md:justify-between md:space-x-5 lg:flex-row lg:justify-between lg:space-x-5'>
				<h1 class='me-4 text-2xl font-bold text-darkgray-900'>{t('SKILLS_PAGE_TITLE')}</h1>

				<SkillLegend />
			</div>

			<Filters
				selectedCrew={selectedCrewSig}
				selectedName={selectedNameSig}
				selectedServiceLine={selectedServiceLineSig}
				selectedSkill={selectedSkillSig}
			/>

			<div class='flex flex-col space-y-5'>
				{Object.entries(tableStructure.value).map(
					([serviceLine, configurationSkills], index) => {
						return !selectedServiceLineSig.value ||
							selectedServiceLineSig.value === serviceLine ? (
							<div key={index} class='flex flex-col space-y-1'>
								<h1 class='text-2xl font-bold text-darkgray-900'>
									{tt('service_line_skill', { serviceLine: serviceLine })}
								</h1>

								<div class='flex flex-wrap'>
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
					}
				)}
			</div>
		</div>
	);
});
