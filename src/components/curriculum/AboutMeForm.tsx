import { component$, useSignal } from '@builder.io/qwik';
import { t } from '../../locale/labels';
import { Input } from '../form/Input';

interface AboutMeFormProps {}

export const AboutMeForm = component$<AboutMeFormProps>(() => {
	const title = useSignal<string>('');
	const description = useSignal<string>('');

	return (
		<div class='w-96'>
			<form class='space-y-3'>
				<Input
					type='text'
					value={title.value}
					label={t('ROLE_LABEL')}
					styleClass='w-full'
					placeholder={t('ROLE_INSERT_LABEL')}
					onInput$={(_, el) => {
						title.value = el.value;
					}}
				/>
				<div>
					<label
						for='education-description'
						class='block text-sm font-normal text-dark-grey'
					>
						{t('SUMMARY_LABEL')}
					</label>
					<textarea
						id='education-description'
						rows={4}
						value={description.value}
						class='mt-0 block w-full rounded-md border border-gray-500 bg-white-100 p-2.5 text-sm text-gray-900'
						placeholder={t('SUMMARY_INSERT_LABEL')}
						onInput$={(_, el) => {
							description.value = el.value;
						}}
					></textarea>
				</div>
			</form>
		</div>
	);
});
