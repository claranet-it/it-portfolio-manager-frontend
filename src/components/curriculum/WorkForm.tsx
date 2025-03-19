import { $, component$, useSignal, useTask$ } from '@builder.io/qwik';
import { WorkUpdateData } from '@models/curriculumVitae';
import { t } from '../../locale/labels';
import { Input } from '../form/Input';
import { YearSelector } from '../form/YearSelector';

interface Props {
	formGroup: WorkUpdateData;
	formID: string;
}

export const WorkForm = component$<Props>(({ formGroup, formID }) => {
	const isDisabled = useSignal<boolean>(formGroup.current || false);

	const setStartYear = $((date: Date) => {
		formGroup.year_start = date.getFullYear();
	});

	const setEndYear = $((date: Date) => {
		formGroup.year_end = date.getFullYear();
	});

	const toogleOngoing = $(() => {
		formGroup.year_end = undefined;
		formGroup.current = true;
		isDisabled.value = !isDisabled.value;
	});

	useTask$(({ track }) => {
		track(() => formGroup.current);
		isDisabled.value = formGroup.current || false;
	});
	return (
		<div class='w-96'>
			<form class='space-y-3'>
				<div class='flex flex-row space-x-4'>
					<YearSelector
						year={formGroup.year_start ? new Date(formGroup.year_start, 0) : undefined}
						title={`${t('TIME_ENTRY_START')}*`}
						confirmChangeYear={setStartYear}
						modalId={`start-work-${formID}`}
					/>
					<YearSelector
						year={formGroup.year_end ? new Date(formGroup.year_end, 0) : undefined}
						title={t('TIME_ENTRY_END')}
						confirmChangeYear={setEndYear}
						modalId={`end-work-${formID}`}
						disabled={isDisabled.value}
					/>
				</div>
				<div class='block py-2'>
					<input
						checked={formGroup.current}
						id={`work-checkbox-ongoing-${formID}`}
						type='checkbox'
						value=''
						onChange$={toogleOngoing}
						class='h-4 w-4 rounded border-gray-300 bg-gray-100 text-clara-red focus:ring-2 focus:ring-clara-red'
					/>
					<label
						for={`work-checkbox-ongoing-${formID}`}
						class='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
					>
						Ongoing
					</label>
				</div>
				<Input
					type='text'
					value={formGroup.institution}
					label={`${t('COMPANY_LABEL')}*`}
					styleClass='w-full'
					placeholder={t('COMPANY_INSERT_LABEL')}
					onInput$={(_, el) => {
						formGroup.institution = el.value;
					}}
				/>
				<Input
					type='text'
					value={formGroup.role}
					label={t('ROLE_LABEL')}
					styleClass='w-full'
					placeholder={t('ROLE_INSERT_LABEL')}
					onInput$={(_, el) => {
						formGroup.role = el.value;
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
						value={formGroup.note}
						class='mt-0 block w-full rounded-md border border-gray-500 bg-white-100 p-2.5 text-sm text-gray-900'
						placeholder={t('NOTES_INSERT_LABEL')}
						onInput$={(_, el) => {
							formGroup.note = el.value;
						}}
					></textarea>
				</div>
			</form>
		</div>
	);
});
