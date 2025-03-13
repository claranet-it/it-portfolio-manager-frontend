import { $, component$, useStore } from '@builder.io/qwik';
import { Education as EducationType } from '@models/curriculumVitae';
import { ModalState } from '@models/modalState';
import { t } from 'src/locale/labels';
import { OptionDropdown } from '../form/OptionDropdown';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';
import { EducationForm } from './EducationForm';
interface Props {
	education?: EducationType[];
}
export const Education = component$<Props>(({ education }) => {
	const newFormModalState = useStore<ModalState>({
		title: t('EDUCATION_ADD'),
		onCancel$: $(() => {}),
		onConfirm$: $(() => {}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_SAVE'),
	});

	const change = $(() => {
		console.log('click');
	});

	return (
		<>
			<div class='flex items-center justify-between'>
				<div class='font-bold text-dark-grey'>{t('EDUCATION_TITLE')}</div>
				<div>
					<div class='flex w-full flex-row'>
						<button
							id='open-new-education-bt'
							onClick$={() => {
								newFormModalState.isVisible = true;
							}}
							type='button'
						>
							<div class='content flex flex-row space-x-1 text-clara-red'>
								<span class='content-center text-xl'>{getIcon('Add')}</span>
								<span class='content-center text-base font-bold'>
									{t('EDUCATION_ADD')}
								</span>
							</div>
						</button>
					</div>
				</div>
			</div>
			<div class='m-0 mt-2 w-full'>
				{education?.map(({ year_end, year_start, note, institution, id }) => {
					return (
						<div
							key={id}
							class='mb-4 flex items-center justify-between border-b border-gray-200 p-2 pl-0'
						>
							<div>
								<h2 class='text-xs text-darkgray-900'>
									{year_start} - {year_end}
								</h2>
								<h1 class='text-xl font-bold text-darkgray-900'>{institution}</h1>
								<h3 class='text-base font-normal text-darkgray-900'>{note}</h3>
							</div>
							<div>
								<OptionDropdown
									id={`education-${id}`}
									icon={getIcon('V3DotsBlack')}
									label={''}
									options={[
										{
											value: t('EDUCATION_EDIT'),
											onChange: change,
										},
										{
											value: t('EDUCATION_DELETE'),
											onChange: change,
											class: 'text-red-500',
										},
									]}
								/>
							</div>
						</div>
					);
				})}
			</div>

			<Modal state={newFormModalState}>
				<EducationForm />
			</Modal>
		</>
	);
});
