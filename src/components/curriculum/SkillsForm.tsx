import { component$, useSignal } from '@builder.io/qwik';
import { t } from '../../locale/labels';

interface AboutMeFormProps {}

export const SkillsForm = component$<AboutMeFormProps>(() => {
	const description = useSignal<string>('');

	return (
		<div class='w-96'>
			<form>
				<label for='education-description' class='block text-sm font-normal text-dark-grey'>
					{t('SKILLS_LABEL')}
				</label>
				<textarea
					id='education-description'
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
