import { Signal, component$, useComputed$, useContext } from '@builder.io/qwik';
import { SkillData, SkillMatrix } from '@models/skill';
import { getSkillScore, skillComparator } from 'src/utils/skill';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import {
	COVERAGE_BAD_LIMIT,
	COVERAGE_GOOD_LIMIT,
	SKILL_LEVEL_SCORE_LIMIT,
} from '../utils/constants';
import { SfRating } from './SfRating';
import { getIcon } from './icons';

type Props = {
	skill: SkillData;
	skillMatrix: Signal<SkillMatrix>;
};

const VISIBLE_SAILORS = 999;

export const SkillCard = component$<Props>(({ skill, skillMatrix }) => {
	const appStore = useContext(AppContext);
	const coverageSig = useComputed$<{
		value: string;
		status: 'BAD' | 'GOOD' | '';
	}>(() => {
		const total = skillMatrix.value.reduce((result, sailor) => {
			const key = Object.keys(sailor)[0];
			const score = getSkillScore(sailor[key], skill.name);
			return result + score;
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
			const score = getSkillScore(sailor[key], skill.name);
			return result + (score >= SKILL_LEVEL_SCORE_LIMIT ? 1 : 0);
		}, 0);
		return total;
	});

	return (
		<div class='m-1 flex w-[288px] flex-col space-y-3 rounded-md border border-darkgray-200 px-4 py-3'>
			{/* Skill name */}
			<div class='item-start flex flex-row space-x-2'>
				<span class='skill-icon text-dark-grey'>{getIcon(skill.name)}</span>
				<h3 class='text-xl font-bold text-dark-grey'>{skill.name.slice(0, 20)}</h3>
			</div>

			{/* Coverage progress bar */}
			<div class='item-center flex w-full flex-col justify-center'>
				<span class='text-dark-gray text-center text-xs font-normal'>
					{t('coverage').toUpperCase()}
				</span>

				<div class='flex flex-col space-y-0'>
					<div class='flex flex-row justify-between'>
						<span class='font-dark-gray text-xs font-bold'>{COVERAGE_BAD_LIMIT}</span>
						<span class='font-dark-gray text-xs font-bold'>{COVERAGE_GOOD_LIMIT}</span>
					</div>

					<div class='mt-1 h-1.5 w-full rounded-full bg-gray-200'>
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
			<div class='flex w-full flex-row justify-between'>
				<span class='font-dark-gray text-xs font-normal'>
					{t('skill_level_label2+').toUpperCase()}
				</span>
				<span class='font-dark-gray text-xs font-bold'>{skillLevelSig.value}</span>
			</div>

			<div class='flex w-full flex-col space-y-0'>
				{skillMatrix.value
					.sort((s1, s2) => skillComparator(s1, s2, skill.name))
					.slice(0, VISIBLE_SAILORS)
					.map((skillMatrix, key) => {
						const [name, skillItem] = Object.entries(skillMatrix)[0];
						return (
							<div key={key} class='flex justify-between align-middle'>
								<span class='flex flex-row gap-0.5 text-sm font-normal'>
									{skillItem.isCompany && getIcon('UserGroup')}
									{name}
								</span>
								<SfRating
									max={appStore.configuration.scoreRange.max}
									value={getSkillScore(skillItem, skill.name) ?? 0}
								/>
							</div>
						);
					})}
			</div>
		</div>
	);
});
