import { Signal, component$, useComputed$, useContext } from '@builder.io/qwik';
import { AppContext } from '../app';
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
		<div class='flex flex-col items-start p-4 m-2 rounded-lg border border-red-200 w-[300px]'>
			<div class='flex flex-col items-center justify-center w-full'>
				<div class='flex items-center justify-center bg-red-200 h-12 w-12 rounded-full border border-red-600'>
					{getIcon(skill)}
				</div>
				<span class='text-lg mt-2 mb-4'>{skill.slice(0, 20)}</span>
			</div>
			<div class='flex flex-col w-full'>
				{skillMatrix.value
					.sort((a, b) =>
						Object.values(a)[0].skills[skill] < Object.values(b)[0].skills[skill]
							? 1
							: -1
					)
					.map((skillMatrix, key) => {
						const [name, { skills }] = Object.entries(skillMatrix)[0];
						return (
							<div key={key} class='flex w-full justify-between'>
								<span>{name}</span>
								<SfRating
									max={appStore.configuration.scoreRange.max}
									value={skills[skill] || 0}
								/>
							</div>
						);
					})}
			</div>
			<div class='flex flex-col justify-center gap-4 w-full mt-4 pr-1'>
				<div class='flex items-center'>
					<div class='font-bold w-[350px]'>
						Coverage ({COVERAGE_GOOD_LIMIT}/{COVERAGE_BAD_LIMIT})
					</div>
					<div class='w-[250px] bg-gray-200 rounded-full h-2.5 mt-1'>
						<div
							class={{
								'h-2.5 rounded-full': true,
								'bg-red-500': coverageSig.value.status === 'BAD',
								'bg-green-500': coverageSig.value.status === 'GOOD',
								'bg-blue-500': coverageSig.value.status === '',
							}}
							style={`width: ${coverageSig.value.value}%`}
						/>
					</div>
				</div>
				<div class='flex justify-between w-full'>
					<span class='font-bold'>Skill Level ({SKILL_LEVEL_SCORE_LIMIT}+)</span>
					<span>{skillLevelSig.value}</span>
				</div>
			</div>
		</div>
	);
});
