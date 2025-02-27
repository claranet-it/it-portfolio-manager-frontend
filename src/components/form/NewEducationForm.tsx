import { $, component$, QRL, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { initFlowbite } from 'flowbite';
import { t } from '../../locale/labels';
import { Button } from '../Button';
import { Input } from './Input';
import { YearSelector } from './YearSelector';

interface NewEducationFormProps {
	onCancel$: QRL;
}

export const NewEducationForm = component$<NewEducationFormProps>(({ onCancel$ }) => {
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
		onCancel$();
	});

	const _onCancel = $(() => {
		onCancel$();
	});

	useVisibleTask$(() => {
		initFlowbite();
	});

	return (
		<div class='w-96 rounded-md bg-white-100 p-4 shadow'>
			<div class='mb-2 flex items-center justify-between border-b border-gray-200 py-2'>
				<h3 class='text-2xl font-bold text-dark-grey'>{t('ADD_NEW_EDUCATION_ENTRY')}</h3>
			</div>

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
					label={t('SCHOOL')}
					styleClass='w-full'
					placeholder={t('SCHOOL_INSERT_LABEL')}
					onInput$={(_, el) => {
						title.value = el.value;
					}}
				/>
				<label
					for='education-description'
					class='mb-1 block text-sm font-normal text-dark-grey'
				>
					{t('DESCRIPTION_LABEL')}
				</label>
				<textarea
					id='education-description'
					rows={4}
					value={description.value}
					class='block w-full rounded-md border border-gray-500 bg-white-100 px-3 py-2 text-sm text-gray-900'
					placeholder={t('DESCRIPTION_INSER_LABEL')}
					onInput$={(_, el) => {
						description.value = el.value;
					}}
				></textarea>
				<div class='flex flex-row justify-end space-x-1'>
					<Button variant={'link'} onClick$={_onCancel}>
						{t('ACTION_CANCEL')}
					</Button>

					<Button onClick$={_handleSubmit}>{t('ACTION_SAVE')}</Button>
				</div>
			</form>
		</div>
	);
});
