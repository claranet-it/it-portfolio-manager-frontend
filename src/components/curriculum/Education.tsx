import { $, component$, QRL } from '@builder.io/qwik';
import { EducationGetResponse } from '@models/curriculumVitae';
import { useEducation } from 'src/hooks/curriculum/useEducation';
import { t } from 'src/locale/labels';
import { OptionDropdown } from '../form/OptionDropdown';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';
import { EducationForm } from './EducationForm';
interface Props {
	education?: EducationGetResponse[];
	onUpdate: QRL;
	onSave: QRL;
	onDelete: QRL;
}
export const Education = component$<Props>(({ education, onUpdate, onSave, onDelete }) => {
	const {
		formGroup,
		formModalState,
		deleteModalState,
		openDeleteDialog,
		openAddDialog,
		openEditDialog,
	} = useEducation(education, onUpdate, onSave, onDelete);

	return (
		<>
			<div class='flex items-center justify-between'>
				<div class='font-bold text-dark-grey'>{t('EDUCATION_TITLE')}</div>
				<div>
					<div class='flex w-full flex-row'>
						<button id='open-new-education-bt' onClick$={openAddDialog} type='button'>
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
				{education?.map(({ year_end, year_start, note, institution, current, id }) => {
					return (
						<div
							key={id}
							class='mb-4 flex items-center justify-between border-b border-gray-200 p-2 pl-0'
						>
							<div>
								<h2 class='text-xs text-darkgray-900'>
									{year_start} - {current ? t('PRESENT') : year_end}
								</h2>
								<h1 class='text-xl font-bold text-darkgray-900'>{institution}</h1>
								<h3 class='whitespace-pre-line text-base font-normal text-darkgray-900'>
									{note}
								</h3>
							</div>
							<div>
								<OptionDropdown
									id={`education-${id}`}
									icon={getIcon('V3DotsBlack')}
									label={''}
									options={[
										{
											value: t('EDUCATION_EDIT'),
											onChange: $(() => openEditDialog(id)),
										},
										{
											value: t('EDUCATION_DELETE'),
											onChange: $(() => openDeleteDialog(id)),
											class: 'text-red-500',
										},
									]}
								/>
							</div>
						</div>
					);
				})}
			</div>

			<Modal state={formModalState}>
				<EducationForm
					formID={formModalState.educationIdToEdit || 'new'}
					formGroup={formGroup}
				/>
			</Modal>

			<Modal state={deleteModalState}></Modal>
		</>
	);
});
