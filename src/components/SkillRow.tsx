import { QRL, component$, useContext } from '@builder.io/qwik';
import { Skill } from '@models/skill';
import { AppContext } from '../app';
import { SfRating } from './SfRating';
import { getIcon } from './icons';

export const SkillRow = component$(
	(props: { key: string; skill: Skill; onClick$: QRL<(value: number) => void> }) => {
		const appStore = useContext(AppContext);
		const titleSkill = props.skill.skill;
		const mainTitleSkill = titleSkill.split('(')[0].trim();
		const subTitleSkill = titleSkill.substring(
			titleSkill.indexOf('('),
			titleSkill.indexOf(')') + 1
		);

		return (
			<div
				key={props.key}
				class='flex items-start justify-between rounded-lg border border-darkgray-200 px-3 py-3'
			>
				<div class='flex items-center justify-center space-x-2'>
					<span class='skill-icon text-2xl text-darkgray-900'>
						{getIcon(props.skill.skill)}
					</span>

					<div class='flex flex-col'>
						<h2 class='text-xl font-bold text-darkgray-900'>{mainTitleSkill}</h2>
						<h3 class='text-sm font-normal text-darkgray-900'>{subTitleSkill}</h3>
					</div>
				</div>
				<div class='ml-4 text-center'>
					<SfRating
						max={appStore.configuration.scoreRange.max}
						value={props.skill.score}
						onClick$={props.onClick$}
					/>
				</div>
			</div>
		);
	}
);
