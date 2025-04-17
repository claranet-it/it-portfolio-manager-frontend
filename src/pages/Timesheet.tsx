import { $, component$, useComputed$, useSignal, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { TimeEntry } from '@models/timeEntry';
import { Button } from 'src/components/Button';
import { NewTaskForm } from 'src/components/form/NewTaskForm';
import { Select } from 'src/components/form/Select';
import { WeekSelector } from 'src/components/form/WeekSelector';
import { getIcon } from 'src/components/icons';
import { ConfirmTimesModal } from 'src/components/modals/ConfirmTimesModal';
import { NewTimeEntryModal } from 'src/components/modals/NewTimeEntryModal';
import { ProjectCategoryLegend } from 'src/components/timesheet/ProjectCategoryLegend';
import { TimeSheetTable } from 'src/components/timesheet/TimeSheetTable';
import { useGetTimeSheetDays } from 'src/hooks/timesheet/useGetTimeSheetDays';
import { usePermissionAccess } from 'src/hooks/usePermissionAccess';
import { limitRoleAccess } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';
import { Modal } from '../components/modals/Modal';
import { t } from '../locale/labels';

export const Timesheet = component$(() => {
	const newProjectCancelAction = $(() => {
		const button = document.getElementById('open-new-project-bt');
		button?.click();
	});

	// Init statement to handler modal alert
	const alertMessageState = useStore<ModalState>({});
	const newTimeEntry = useSignal<TimeEntry>();
	const { days, from, to, nextWeek, prevWeek, currentWeek, setWeek } = useGetTimeSheetDays();
	const { usersOptions, userSelected, userIdSelected } = usePermissionAccess();

	const canImpersonate = useComputed$(async () => limitRoleAccess(Roles.TEAM_LEADER));

	const showTemplateList = useSignal(false);

	const handleViewTemplateList = $(() => {
		showTemplateList.value = true;
	});

	const handleGoBack = $(() => {
		showTemplateList.value = false;
	});

	return (
		<>
			<div class='w-full space-y-6 px-6 pb-10 pt-2.5'>
				{showTemplateList.value ? (
					<>
						<h1 class='text-2xl font-bold text-darkgray-900'>
							<button
								class='inline-flex items-center gap-2 rounded border-0 bg-transparent'
								onClick$={handleGoBack}
							>
								{getIcon('ArrowBack')} {t('TEMPLATE_PAGE_TITLE')}
							</button>
						</h1>
						<div class='relative overflow-x-auto'>
							<table class='w-full'>
								<thead class='bg-surface-20 py-3 text-xs text-gray-700'>
									<tr>
										<th
											scope='col'
											class='border border-surface-70 px-6 text-left'
										>
											<h3 class='text-base text-dark-grey'>
												{t('TEMPLATE_TABLE_MY_TEMPLATES_COL_LABEL')}
											</h3>
										</th>
										<th
											scope='col'
											class='border border-surface-70 px-6 text-left'
										>
											<h3 class='text-base text-dark-grey'>
												{t('TEMPLATE_TABLE_FROM_COL_LABEL')}
											</h3>
										</th>
										<th
											scope='col'
											class='border border-surface-70 px-6 text-left'
										>
											<h3 class='text-base text-dark-grey'>
												{t('TEMPLATE_TABLE_TO_COL_LABEL')}
											</h3>
										</th>
										<th
											scope='col'
											class='border border-surface-70 px-6 text-left'
										>
											<h3 class='text-base text-dark-grey'>
												{t('TEMPLATE_TABLE_DAYS_COL_LABEL')}
											</h3>
										</th>
										<th
											scope='col'
											class='border border-surface-70 px-6 text-left'
										>
											<h3 class='text-base text-dark-grey'>
												{t('TEMPLATE_TABLE_TOTAL_PLANNED_HOURS_COL_LABEL')}
											</h3>
										</th>
										<th
											scope='col'
											class='border border-surface-70 px-6 text-left'
										>
											<h3 class='text-base text-dark-grey'>
												{t('TEMPLATE_TABLE_ACTIONS_COL_LABEL')}
											</h3>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr key={'key'} class='border-b bg-white'>
										<td
											scope='row'
											class='border border-surface-50 px-6 py-4 text-left font-medium'
										>
											<div class='flex flex-col'>
												<h4 class='text-sm font-normal text-darkgray-500'>
													{`${t('CLIENT')}: Customer`}
												</h4>
												<h4 class='text-base font-bold text-dark-grey'>
													PROJECT
												</h4>
												<h4 class='text-dark-gray-900 text-sm font-normal'>
													{`${t('TASK')}: TASK`}
												</h4>
											</div>
										</td>
										<td
											scope='row'
											class='border border-surface-50 px-6 py-4 text-left font-medium'
										></td>
										<td
											scope='row'
											class='border border-surface-50 px-6 py-4 text-left font-medium'
										></td>
										<td
											scope='row'
											class='border border-surface-50 px-6 py-4 text-left font-medium'
										></td>
										<td
											scope='row'
											class='border border-surface-50 px-6 py-4 text-left font-medium'
										></td>
										<td
											scope='row'
											class='border border-surface-50 px-4 py-3 text-left font-medium'
										>
											<button onClick$={() => {}}>{getIcon('Edit')}</button>
											<button onClick$={() => {}}>{getIcon('Bin')}</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</>
				) : (
					<>
						<div class='flex flex-col gap-2'>
							<h1 class='text-2xl font-bold text-darkgray-900'>
								{t('TIMESHEET_PAGE_TITLE')}
							</h1>
							<div class='items-between flex items-end justify-between sm:flex-col sm:items-start'>
								<ProjectCategoryLegend />

								<div class='flex items-end justify-end gap-2 sm:flex-col sm:items-start'>
									{canImpersonate.value && (
										<div class='mr-4 w-60 min-w-56 sm:w-full'>
											<Select
												id='user-timesheet'
												label='Select user timesheet'
												size='m'
												placeholder='Select user'
												options={usersOptions}
												value={userSelected}
											/>
										</div>
									)}
									<WeekSelector
										title={t('DATARANGE_SELECT_WEEK_LABEL')}
										from={from}
										to={to}
										nextAction={nextWeek}
										prevAction={prevWeek}
										confirmChangeRange={setWeek}
									/>
									<Button variant={'outline'} onClick$={currentWeek}>
										{t('THIS_WEEK')}
									</Button>
								</div>
							</div>
						</div>

						<TimeSheetTable
							newTimeEntry={newTimeEntry}
							days={days}
							from={from}
							to={to}
							userImpersonationId={userIdSelected}
						>
							<NewTimeEntryModal q:slot='newProject'>
								<NewTaskForm
									timeEntry={newTimeEntry}
									alertMessageState={alertMessageState}
									onCancel$={newProjectCancelAction}
								/>
							</NewTimeEntryModal>

							<ConfirmTimesModal q:slot='confirmTimes' />
						</TimeSheetTable>

						<Button variant={'outline'} onClick$={handleViewTemplateList}>
							{t('VIEW_TEMPLATE_LIST')}
						</Button>
					</>
				)}
			</div>

			<Modal state={alertMessageState}>
				<p q:slot='modalBody' class='text-dark-gray text-base leading-relaxed'>
					{alertMessageState.message}
				</p>
			</Modal>
		</>
	);
});
