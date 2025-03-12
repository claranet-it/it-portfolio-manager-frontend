import { $, component$, useSignal } from '@builder.io/qwik';
import { t } from '../../locale/labels';
import { Input } from '../form/Input';
import { YearSelector } from '../form/YearSelector';

interface NewEducationFormProps {}

export const EducationForm = component$<NewEducationFormProps>(() => {
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

	const _handleSubmit = $(() => {
		console.log('##### form');
		console.log('##### title', title.value);
		console.log('##### description', description.value);
		console.log('##### start year', startYear.value);
		console.log('##### end year', startYear.value);
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
					label={t('SCHOOL_LABEL')}
					styleClass='w-full'
					placeholder={t('SCHOOL_INSERT_LABEL')}
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
