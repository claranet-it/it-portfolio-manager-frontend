import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { RepotTab } from '@models/report';
import { Task } from '@models/task';
import { Button } from 'src/components/Button';
import { DataRange } from 'src/components/form/DataRange';
import { getIcon } from 'src/components/icons';
import { GroupByList } from 'src/components/report/GropuByList';
import { ProductivityLegend } from 'src/components/report/ProductivityLegend';
import { ProductivityTable } from 'src/components/report/ProductivityTable';
import { ProjectReportDetails } from 'src/components/report/ProjectReportDetails';
import { ProjectReportPreview } from 'src/components/report/ProjectReportPreview';
import { ReportFilters } from 'src/components/report/ReportFilters';
import { ReportHeader } from 'src/components/report/ReportHeader';
import { useProductivity } from 'src/hooks/report/useProductivity';
import { useReportProject } from 'src/hooks/report/useReportProject';
import { useGetTimeSheetDays } from 'src/hooks/timesheet/useGetTimeSheetDays';
import { t } from 'src/locale/labels';
import { INIT_PROJECT_VALUE } from 'src/utils/constants';
import { handlePrint } from 'src/utils/handlePrint';

export const Report = component$(() => {
	const { from, to, nextWeek, prevWeek, currentWeek } = useGetTimeSheetDays();

	const selectedCustomerSig = useSignal<Customer>('');
	const selectedProjectSig = useSignal<Project>(INIT_PROJECT_VALUE);
	const selectedTaskSig = useSignal<Task>('' as Task);
	const selectedNameSig = useSignal<string>('');
	const selectedTab = useSignal<RepotTab>('project');
	const showProjectsDetails = useSignal(false);

	const productivityTableRef = useSignal<HTMLElement>();
	const projectReportDetailsRef = useSignal<HTMLElement>();
	const projectReportPreviewRef = useSignal<HTMLElement>();

	const { results: productivityResults } = useProductivity(
		selectedCustomerSig,
		selectedProjectSig,
		selectedTaskSig,
		selectedNameSig,
		from,
		to,
		selectedTab
	);

	const { results: projectResults } = useReportProject(
		selectedCustomerSig,
		selectedProjectSig,
		selectedTaskSig,
		selectedNameSig,
		from,
		to,
		selectedTab
	);

	useVisibleTask$(({ track }) => {
		track(() => selectedCustomerSig.value);
		track(() => selectedProjectSig.value);
		track(() => selectedTaskSig.value);
		track(() => selectedNameSig.value);
		showProjectsDetails.value =
			selectedCustomerSig.value !== '' ||
			selectedProjectSig.value !== INIT_PROJECT_VALUE ||
			selectedTaskSig.value !== '' ||
			selectedNameSig.value !== '';
	});

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
				selectedCustomer={selectedCustomerSig}
				selectedProject={selectedProjectSig}
				selectedTask={selectedTaskSig}
				selectedName={selectedNameSig}
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
						id='productivity'
						role='tabpanel'
						aria-labelledby='productivity-tab'
					>
						<div class='flex sm:flex-col md:flex-row md:justify-between lg:flex-row lg:justify-between'>
							<ProductivityLegend />
							<Button
								variant={'link'}
								onClick$={() => handlePrint(productivityTableRef)}
							>
								<span class='inline-flex items-end gap-1'>
									{getIcon('Downlaod')} Download report
								</span>
							</Button>
						</div>

						<ProductivityTable
							results={productivityResults.data}
							ref={productivityTableRef}
						/>
					</div>
					<div
						class='flex hidden flex-col gap-6'
						id='projects'
						role='tabpanel'
						aria-labelledby='projects-tab'
					>
						{showProjectsDetails.value ? (
							<div class='flex flex-col gap-1'>
								<ReportHeader
									printableComponent={projectReportDetailsRef}
									customer={selectedCustomerSig}
									data={projectResults.data}
								/>

								<ProjectReportDetails
									ref={projectReportDetailsRef}
									data={projectResults.data}
									from={from}
									to={to}
								/>

								{selectedProjectSig.value !== INIT_PROJECT_VALUE && (
									<GroupByList
										project={selectedProjectSig}
										data={projectResults.data}
									/>
								)}
							</div>
						) : (
							<div class='flex flex-col gap-6'>
								<h3 class='text-base font-bold text-dark-grey'>
									{t('TIMESHEET_TABLE_PROJECT_COL_LABEL')}
								</h3>
								<ReportHeader
									printableComponent={projectReportPreviewRef}
									data={projectResults.data}
									from={from}
									to={to}
									showTopCustomer
									showTopProject
								/>

								<ProjectReportPreview
									ref={projectReportPreviewRef}
									data={projectResults.data}
									from={from}
									to={to}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
});
