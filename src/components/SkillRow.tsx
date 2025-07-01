import { QRL, component$, useContext } from '@builder.io/qwik';
import { Skill } from '@models/skill';
import { getSkillIcon } from 'src/utils/skill';
import { AppContext } from '../app';
import { SfRating } from './SfRating';

type Props = {
	key: string;
	skill: Skill;
	onClick$: QRL<(value: number) => void>;
	serviceLine: string;
};
export const SkillRow = component$<Props>((props) => {
	const appStore = useContext(AppContext);
	const titleSkill = props.skill.skill;
	const mainTitleSkill = titleSkill.name;
	const subTitleSkill = titleSkill.description;

	return (
		<div
			key={props.key}
			class='flex items-start justify-between rounded-lg border border-darkgray-200 px-3 py-3'
		>
			<div class='flex items-center justify-center space-x-2'>
				<span class='skill-icon text-2xl text-darkgray-900'>
					{getSkillIcon(props.serviceLine, props.skill.skill.name)}
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
});
