import { Signal, component$, useComputed$, useContext } from '@builder.io/qwik';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import {
	COVERAGE_BAD_LIMIT,
	COVERAGE_GOOD_LIMIT,
	SKILL_LEVEL_SCORE_LIMIT,
} from '../utils/constants';
import { SkillMatrix } from '../utils/types';
import { SfRating } from './SfRating';
import { getIcon } from './icons';

type Props = {
	skill: string;
	skillMatrix: Signal<SkillMatrix>;
};

export const SkillCard = component$<Props>(({ skill, skillMatrix }) => {
	const appStore = useContext(AppContext);
	const coverageSig = useComputed$<{
		value: string;
		status: 'BAD' | 'GOOD' | '';
	}>(() => {
		const total = skillMatrix.value.reduce((result, sailor) => {
			const key = Object.keys(sailor)[0];
			return result + sailor[key].skills[skill];
		}, 0);

		const result =
			(total * 100) / (skillMatrix.value.length * appStore.configuration.scoreRange.max);

		return {
			value: result.toFixed(2),
			status:
				result < COVERAGE_BAD_LIMIT ? 'BAD' : result > COVERAGE_GOOD_LIMIT ? 'GOOD' : '',
		};
	});

	const skillLevelSig = useComputed$(() => {
		const total = skillMatrix.value.reduce((result, sailor) => {
			const key = Object.keys(sailor)[0];
			return result + (sailor[key].skills[skill] >= SKILL_LEVEL_SCORE_LIMIT ? 1 : 0);
		}, 0);
		return total;
	});

	return (
		<div class='flex flex-col py-3 px-4 m-1 rounded-md border border-darkgray-200 w-[288px] space-y-3'>
			{/* Skill name */}
			<div class='flex flex-row item-start space-x-2'>
				<span class='text-dark-grey skill-icon'>{getIcon(skill)}</span>
				<h3 class='text-dark-grey text-xl font-bold'>{skill.slice(0, 20)}</h3>
			</div>

			{/* Coverage progress bar */}
			<div class='flex flex-col item-center  justify-center w-full'>
				<span class='text-xs font-normal text-dark-gray text-center'>
					{t('coverage').toUpperCase()}
				</span>

				<div class='flex flex-col space-y-0'>
					<div class='flex flex-row justify-between'>
						<span class='text-xs font-bold font-dark-gray'>{COVERAGE_BAD_LIMIT}</span>
						<span class='text-xs font-bold font-dark-gray'>{COVERAGE_GOOD_LIMIT}</span>
					</div>

					<div class='w-full bg-gray-200 rounded-full h-1.5 mt-1'>
						<div
							class={{
								'h-1.5 rounded-full': true,
								'bg-red-500': coverageSig.value.status === 'BAD',
								'bg-green-1': coverageSig.value.status === 'GOOD',
								'bg-yellow-100': coverageSig.value.status === '',
							}}
							style={`width: ${coverageSig.value.value}%`}
						/>
					</div>
				</div>
			</div>

			{/* Skill Level */}
			<div class='w-full flex flex-row justify-between'>
				<span class='text-xs font-normal font-dark-gray'>
					{t('skill_level_label2+').toUpperCase()}
				</span>
				<span class='text-xs font-bold font-dark-gray'>{skillLevelSig.value}</span>
			</div>

			<div class='w-full flex flex-col space-y-0'>
				{skillMatrix.value
					.sort((a, b) =>
						Object.values(a)[0].skills[skill] < Object.values(b)[0].skills[skill]
							? 1
							: -1
					)
					.slice(0, 4) //only the first four
					.map((skillMatrix, key) => {
						const [name, { skills }] = Object.entries(skillMatrix)[0];
						return (
							<div key={key} class='flex justify-between '>
								<span class='text-sm font-normal'>{name}</span>
								<SfRating
									max={appStore.configuration.scoreRange.max}
									value={skills[skill] || 0}
								/>
							</div>
						);
					})}
			</div>
		</div>
	);
});
