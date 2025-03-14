import { component$, Signal } from '@builder.io/qwik';
import { t } from '../../locale/labels';

interface Props {
	description: Signal<string>;
}

export const SkillsForm = component$<Props>(({ description }) => {
	return (
		<div class='w-96'>
			<form>
				<label for='skill-description' class='block text-sm font-normal text-dark-grey'>
					{t('SKILLS_LABEL')}
				</label>
				<textarea
					id='skill-description'
					rows={4}
					value={description.value}
					class='mt-0 block w-full rounded-md border border-gray-500 bg-white-100 p-2.5 text-sm text-gray-900'
					placeholder={t('SKILLS_INSERT_LABEL')}
					onInput$={(_, el) => {
						description.value = el.value;
					}}
				></textarea>
			</form>
		</div>
	);
});
