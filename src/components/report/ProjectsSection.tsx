import { component$, Signal, useComputed$, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { ReportTab } from '@models/report';
import { Task } from '@models/task';
import { UserProfile } from '@models/user';
import { useReportProject } from 'src/hooks/report/useReportProject';
import { t } from 'src/locale/labels';
import { ToggleState } from '../form/RadioDropdown';
import { getIcon } from '../icons';
import { InfoCard } from '../InfoCard';
import { GroupByList } from './GropuByList';
import { ProjectReportDetails } from './ProjectReportDetails';
import { ProjectReportPreview } from './ProjectReportPreview';
import { ReportHeader } from './ReportHeader';

interface ReportProps {
	selectedCustomersSig: Signal<Customer[]>;
	selectedProjectsSig: Signal<Project[]>;
	selectedTasksSig: Signal<Task[]>;
	selectedUsersSig: Signal<UserProfile[]>;
	selectedTab: Signal<ReportTab>;
	afterHoursSig: Signal<ToggleState>;
	to: Signal<Date>;
	from: Signal<Date>;
}

export const ProjectsSection = component$<ReportProps>(
	({
		to,
		from,
		selectedCustomersSig,
		selectedProjectsSig,
		selectedTasksSig,
		selectedUsersSig,
		selectedTab,
		afterHoursSig,
	}) => {
		const projectReportDetailsRef = useSignal<HTMLElement>();
		const projectReportPreviewRef = useSignal<HTMLElement>();

		const { results: projectResults } = useReportProject(
			selectedCustomersSig,
			selectedProjectsSig,
			selectedTasksSig,
			selectedUsersSig,
			afterHoursSig,
			from,
			to,
			selectedTab
		);

		const showProjectsDetails = useComputed$(() => {
			return (
				selectedCustomersSig.value.length !== 0 ||
				selectedProjectsSig.value.length !== 0 ||
				selectedTasksSig.value.length !== 0 ||
				selectedUsersSig.value.length !== 0
			);
		});

		if (!projectResults.value.length) {
			return (
				<InfoCard title={t('INFOCARD_TITLE_PROJECTS')} body={t('INFOCARD_BODY_PROJECTS')} />
			);
		}

		return (
			<>
				{showProjectsDetails.value ? (
					<div ref={projectReportDetailsRef} class='flex flex-col gap-1'>
						<div class='brickly-logo-pdf-download flex hidden justify-end'>
							<div class='px-6 py-4 sm:text-center [&_svg]:sm:inline'>
								{getIcon('BricklyRedLogo')}
							</div>
						</div>

						<ReportHeader
							printableComponent={projectReportDetailsRef}
							customer={selectedCustomersSig}
							data={projectResults.value}
							from={from}
							to={to}
						/>

						<ProjectReportDetails data={projectResults.value} from={from} to={to} />

						{projectResults.value.length > 0 && (
							<GroupByList data={projectResults} from={from} to={to} />
						)}
					</div>
				) : (
					<div ref={projectReportPreviewRef} class='flex flex-col gap-6'>
						<div class='brickly-logo-pdf-download flex hidden justify-end'>
							<div class='px-6 py-4 sm:text-center [&_svg]:sm:inline'>
								{getIcon('BricklyRedLogo')}
							</div>
						</div>

						<ReportHeader
							printableComponent={projectReportPreviewRef}
							data={projectResults.value}
							from={from}
							to={to}
							showTopCustomer
							showTopProject
						/>

						<ProjectReportPreview data={projectResults.value} from={from} to={to} />

						{projectResults.value.length > 0 && (
							<GroupByList data={projectResults} from={from} to={to} />
						)}
					</div>
				)}
			</>
		);
	}
);
