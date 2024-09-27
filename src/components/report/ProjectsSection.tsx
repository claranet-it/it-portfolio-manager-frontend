import { component$, Signal, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Project } from '@models/project';
import { ReportTab } from '@models/report';
import { Task } from '@models/task';
import { UserProfile } from '@models/user';
import { useReportProject } from 'src/hooks/report/useReportProject';
import { getIcon } from '../icons';
import { GroupByList } from './GropuByList';
import { ProjectReportDetails } from './ProjectReportDetails';
import { ProjectReportPreview } from './ProjectReportPreview';
import { ReportHeader } from './ReportHeader';

interface ReportProps {
	selectedCustomersSig: Signal<string[]>;
	selectedProjectsSig: Signal<Project[]>;
	selectedTasksSig: Signal<Task[]>;
	selectedUsersSig: Signal<UserProfile[]>;
	selectedTab: Signal<ReportTab>;
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
	}) => {
		const projectReportDetailsRef = useSignal<HTMLElement>();
		const projectReportPreviewRef = useSignal<HTMLElement>();
		const afterHoursSig = useSignal(false);

		const showProjectsDetails = useSignal(false);

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

		useVisibleTask$(({ track }) => {
			track(() => selectedCustomersSig.value);
			track(() => selectedProjectsSig.value);
			track(() => selectedTasksSig.value);
			track(() => selectedUsersSig.value);
			showProjectsDetails.value =
				selectedCustomersSig.value.length !== 0 ||
				selectedProjectsSig.value.length !== 0 ||
				selectedTasksSig.value.length !== 0 ||
				selectedUsersSig.value.length !== 0;
		});

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
							afterHoursSig={afterHoursSig}
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
							afterHoursSig={afterHoursSig}
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
