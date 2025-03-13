import { $, component$, useSignal } from '@builder.io/qwik';
import { t } from '../../locale/labels';
import { Input } from '../form/Input';
import { YearSelector } from '../form/YearSelector';

interface NewEducationFormProps {}

export const WorkForm = component$<NewEducationFormProps>(() => {
	const title = useSignal<string>('');
	const description = useSignal<string>('');
	const startYear = useSignal<Date>(new Date());
	const endYear = useSignal<Date>(new Date());
	const setStartYear = $((date: Date) => {
		startYear.value = date;
	});

	const setEndYear = $((date: Date) => {
		endYear.value = date;
	});

	return (
		<div class='w-96'>
			<form class='space-y-3'>
				<div class='flex flex-row space-x-4'>
					<YearSelector
						year={startYear}
						title={t('TIME_ENTRY_START')}
						confirmChangeYear={setStartYear}
						modalId={'start'}
					/>
					<YearSelector
						year={endYear}
						title={t('TIME_ENTRY_END')}
						confirmChangeYear={setEndYear}
						modalId={'end'}
					/>
				</div>

				<Input
					type='text'
					value={title.value}
					label={t('COMPANY_LABEL')}
					styleClass='w-full'
					placeholder={t('COMPANY_INSERT_LABEL')}
					onInput$={(_, el) => {
						title.value = el.value;
					}}
				/>
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
						{t('NOTES_LABEL')}
					</label>
					<textarea
						id='education-description'
						rows={4}
						value={description.value}
						class='mt-0 block w-full rounded-md border border-gray-500 bg-white-100 p-2.5 text-sm text-gray-900'
						placeholder={t('NOTES_INSERT_LABEL')}
						onInput$={(_, el) => {
							description.value = el.value;
						}}
					></textarea>
				</div>
			</form>
		</div>
	);
});
