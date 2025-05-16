import { $, component$, useComputed$, useSignal, useStore } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { ProjectType } from '@models/project';
import { Template } from '@models/template';
import { TimeEntry } from '@models/timeEntry';
import { Button } from 'src/components/Button';
import { NewTaskForm } from 'src/components/form/NewTaskForm';
import { Select } from 'src/components/form/Select';
import { WeekSelector } from 'src/components/form/WeekSelector';
import { NewTimeEntryModal } from 'src/components/modals/NewTimeEntryModal';
import { ProjectCategoryLegend } from 'src/components/timesheet/ProjectCategoryLegend';
import { TemplateList } from 'src/components/timesheet/TemplateList';
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

	const templates = useSignal<Template[]>([
		{
			id: '1',
			user: 'maria.teresa.graziano@claranet.com',
			date_start: '2025-05-1',
			date_end: '2025-05-15',
			customer: 'Claranet',
			project: {
				name: 'Funzionale',
				type: 'billable' as ProjectType,
				plannedHours: 100,
				completed: false,
			},
			timehours: 8,
			daytime: [0, 6],
		},
		{
			id: '2',
			user: 'maria.teresa.graziano@claranet.com',
			date_start: '2025-05-01',
			date_end: '2025-05-25',
			customer: 'Claranet',
			project: {
				name: 'Assenze',
				type: 'absence' as ProjectType,
				plannedHours: 100,
				completed: false,
			},
			task: { name: 'FERIE', completed: false, plannedHours: 50 },
			timehours: 8,
			daytime: [1, 3],
		},
	]);

	return (
		<>
			<div class='w-full space-y-6 px-6 pb-10 pt-2.5'>
				{showTemplateList.value ? (
					<TemplateList templates={templates} onBack={handleGoBack} />
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
							templates={templates}
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
