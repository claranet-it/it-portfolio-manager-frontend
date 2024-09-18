import { component$, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { ReportTab } from '@models/report';
import { Task } from '@models/task';
import { UserProfile } from '@models/user';
import { Button } from 'src/components/Button';
import { DataRange } from 'src/components/form/DataRange';
import { ProductivitySection } from 'src/components/report/ProductivitySection';
import { ProjectsSection } from 'src/components/report/ProjectsSection';
import { ReportFilters } from 'src/components/report/ReportFilters';
import { useGetTimeSheetDays } from 'src/hooks/timesheet/useGetTimeSheetDays';
import { t } from 'src/locale/labels';

export const Report = component$(() => {
	const { from, to, nextWeek, prevWeek, currentWeek } = useGetTimeSheetDays();

	const selectedCustomersSig = useSignal<Customer[]>([]);
	const selectedProjectsSig = useSignal<Project[]>([]);
	const selectedTasksSig = useSignal<Task[]>([]);
	const selectedUsersSig = useSignal<UserProfile[]>([]);
	const selectedTab = useSignal<ReportTab>('project');

	return (
		<div class='w-full space-y-6 px-6 py-2.5'>
			<div class='flex justify-between gap-2 sm:flex-col md:flex-row lg:flex-row'>
				<h1 class='me-4 text-2xl font-bold text-darkgray-900'>{t('REPORT_PAGE_TITLE')}</h1>

				<div class='flex flex-row gap-2'>
					<DataRange from={from} to={to} nextAction={nextWeek} prevAction={prevWeek} />
					<div class='flex items-end'>
						<Button variant={'outline'} onClick$={currentWeek}>
							{t('THIS_WEEK')}
						</Button>
					</div>
				</div>
			</div>

			<ReportFilters
				selectedCustomers={selectedCustomersSig}
				selectedProjects={selectedProjectsSig}
				selectedTasks={selectedTasksSig}
				selectedUsers={selectedUsersSig}
			/>

			{/* TAB Selection */}
			<div class='flex flex-col space-y-3'>
				<div class='border-b border-surface-70'>
					<ul
						class='-mb-px flex flex-wrap text-center text-sm'
						id='default-tab'
						data-tabs-toggle='#report-tab-content'
						role='tablist'
						data-tabs-active-classes='text-dark-grey border-dark-grey'
						data-tabs-inactive-classes='text-dark-grey'
					>
						<li class='me-2' role='productivity'>
							<button
								class='inline-block border-b-2 p-4 text-dark-grey hover:border-dark-grey'
								id='projects-tab'
								data-tabs-target='#projects'
								type='button'
								role='tab'
								aria-controls='projects'
								aria-selected='false'
								onClick$={() => (selectedTab.value = 'project')}
							>
								{t('PROJECTS_LABEL')}
							</button>
						</li>
						<li class='me-2' role='productivity'>
							<button
								class='inline-block border-b-2 p-4 text-dark-grey hover:border-dark-grey'
								id='productivity-tab'
								data-tabs-target='#productivity'
								type='button'
								role='tab'
								aria-controls='productivity'
								aria-selected='false'
								onClick$={() => (selectedTab.value = 'productivity')}
							>
								{t('PRODUCTIVITY_LABEL')}
							</button>
						</li>
					</ul>
				</div>
				<div id='report-tab-content' class='mb-2 border border-surface-70 p-6'>
					<div
						class='flex hidden flex-col gap-6'
						id='projects'
						role='tabpanel'
						aria-labelledby='projects-tab'
					>
						<ProjectsSection
							selectedCustomersSig={selectedCustomersSig}
							selectedProjectsSig={selectedProjectsSig}
							selectedTasksSig={selectedTasksSig}
							selectedUsersSig={selectedUsersSig}
							selectedTab={selectedTab}
							to={to}
							from={from}
						/>
					</div>
					<div
						class='flex hidden flex-col gap-6'
						id='productivity'
						role='tabpanel'
						aria-labelledby='productivity-tab'
					>
						<ProductivitySection
							selectedCustomersSig={selectedCustomersSig}
							selectedProjectsSig={selectedProjectsSig}
							selectedTasksSig={selectedTasksSig}
							selectedUsersSig={selectedUsersSig}
							selectedTab={selectedTab}
							to={to}
							from={from}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
