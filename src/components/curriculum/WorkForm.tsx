import { $, component$, useSignal } from '@builder.io/qwik';
import { t } from '../../locale/labels';
import { Input } from '../form/Input';
import { YearSelector } from '../form/YearSelector';

interface Props {
	formGroup: {
		startYear?: number;
		endYear?: number;
		role?: string;
		company?: string;
		notes?: string;
	};
	formID: string;
}

export const WorkForm = component$<Props>(({ formGroup, formID }) => {
	const startYearForm = useSignal<Date>(
		formGroup.startYear ? new Date(formGroup.startYear) : new Date()
	);
	const endYearForm = useSignal<Date>(
		formGroup.endYear ? new Date(formGroup.endYear) : new Date()
	);

	const setStartYear = $((date: Date) => {
		formGroup.startYear = date.getFullYear();
	});

	const setEndYear = $((date: Date) => {
		formGroup.endYear = date.getFullYear();
	});

	return (
		<div class='w-96'>
			<form class='space-y-3'>
				<div class='flex flex-row space-x-4'>
					<YearSelector
						year={startYearForm}
						title={t('TIME_ENTRY_START')}
						confirmChangeYear={setStartYear}
						modalId={`start-work-${formID}`}
					/>
					<YearSelector
						year={endYearForm}
						title={t('TIME_ENTRY_END')}
						confirmChangeYear={setEndYear}
						modalId={`end-work-${formID}`}
					/>
				</div>

				<Input
					type='text'
					value={formGroup.company}
					label={t('COMPANY_LABEL')}
					styleClass='w-full'
					placeholder={t('COMPANY_INSERT_LABEL')}
					onInput$={(_, el) => {
						formGroup.company = el.value;
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
						value={formGroup.notes}
						class='mt-0 block w-full rounded-md border border-gray-500 bg-white-100 p-2.5 text-sm text-gray-900'
						placeholder={t('NOTES_INSERT_LABEL')}
						onInput$={(_, el) => {
							formGroup.notes = el.value;
						}}
					></textarea>
				</div>
			</form>
		</div>
	);
});
