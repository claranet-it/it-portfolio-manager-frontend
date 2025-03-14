import { $, component$ } from '@builder.io/qwik';
import { Work as WorkType } from '@models/curriculumVitae';
import { useWork } from 'src/hooks/curriculum/useWork';
import { t } from 'src/locale/labels';
import { OptionDropdown } from '../form/OptionDropdown';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';
import { WorkForm } from './WorkForm';

interface Props {
	work?: WorkType[];
}

export const Work = component$<Props>(({ work }) => {
	const {
		formGroup,
		formModalState,
		deleteModalState,
		openDeleteDialog,
		openAddDialog,
		openEditDialog,
	} = useWork(work);

	return (
		<>
			<div class='flex items-center justify-between'>
				<div class='font-bold text-dark-grey'>{t('WORK_TITLE')}</div>
				<div>
					<div class='flex w-full flex-row'>
						<button id='open-new-education-bt' onClick$={openAddDialog} type='button'>
							<div class='content flex flex-row space-x-1 text-clara-red'>
								<span class='content-center text-xl'>{getIcon('Add')}</span>
								<span class='content-center text-base font-bold'>
									{t('WORK_ADD')}
								</span>
							</div>
						</button>
					</div>
				</div>
			</div>
			<div class='m-0 mt-2 w-full'>
				{work?.map((wrk) => {
					return (
						<div
							key={wrk.id}
							class='mb-4 flex items-center justify-between border-b border-gray-200 p-2 pl-0'
						>
							<div>
								<h2 class='text-xs text-darkgray-900'>
									{wrk.year_start} - {wrk.year_end}
								</h2>
								<h1 class='text-xl font-bold text-darkgray-900'>
									{wrk.institution}
								</h1>
								<h3 class='text-base font-normal text-darkgray-900'>{wrk.role}</h3>
								<h3 class='text-base font-normal text-darkgray-900'>{wrk.note}</h3>
							</div>
							<div>
								<OptionDropdown
									id={`work-${wrk.id}`}
									icon={getIcon('V3DotsBlack')}
									label={''}
									options={[
										{
											value: t('WORK_EDIT'),
											onChange: $(() => openEditDialog(wrk.id)),
										},
										{
											value: t('WORK_DELETE'),
											onChange: $(() => openDeleteDialog(wrk.id)),
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
				<WorkForm formID={formModalState.workIdToEdit || 'new'} formGroup={formGroup} />
			</Modal>

			<Modal state={deleteModalState}></Modal>
		</>
	);
});
