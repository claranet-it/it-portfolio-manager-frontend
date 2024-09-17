import { component$, Signal, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Project } from '@models/project';
import { ReportTab } from '@models/report';
import { Task } from '@models/task';
import { UserProfile } from '@models/user';
import { useReportProject } from 'src/hooks/report/useReportProject';
import { GroupByList } from './GropuByList';
import { ProjectReportDetails } from './ProjectReportDetails';
import { ProjectReportPreview } from './ProjectReportPreview';
import { ReportHeader } from './ReportHeader';

interface ReportProps {
	selectedCustomersSig: Signal<string[]>;
	selectedProjectsSig: Signal<Project[]>;
	selectedTasksSig: Signal<Task[]>;
	selectedNamesSig: Signal<UserProfile[]>;
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
		selectedNamesSig,
		selectedTab,
	}) => {
		const projectReportDetailsRef = useSignal<HTMLElement>();
		const projectReportPreviewRef = useSignal<HTMLElement>();

		const showProjectsDetails = useSignal(false);

		const { results: projectResults } = useReportProject(
			selectedCustomersSig,
			selectedProjectsSig,
			selectedTasksSig,
			selectedNamesSig,
			from,
			to,
			selectedTab
		);

		useVisibleTask$(({ track }) => {
			track(() => selectedCustomersSig.value);
			track(() => selectedProjectsSig.value);
			track(() => selectedTasksSig.value);
			track(() => selectedNamesSig.value);
			showProjectsDetails.value =
				selectedCustomersSig.value.length !== 0 ||
				selectedProjectsSig.value.length !== 0 ||
				selectedTasksSig.value.length !== 0 ||
				selectedNamesSig.value.length !== 0;
		});

		return (
			<>
				{showProjectsDetails.value ? (
					<div class='flex flex-col gap-1'>
						<ReportHeader
							printableComponent={projectReportDetailsRef}
							customer={selectedCustomersSig}
							data={projectResults.value}
							from={from}
							to={to}
						/>

						<ProjectReportDetails
							ref={projectReportDetailsRef}
							data={projectResults.value}
							from={from}
							to={to}
						/>

						{projectResults.value.length > 0 && (
							<GroupByList data={projectResults} from={from} to={to} />
						)}
					</div>
				) : (
					<div class='flex flex-col gap-6'>
						<ReportHeader
							printableComponent={projectReportPreviewRef}
							data={projectResults.value}
							from={from}
							to={to}
							showTopCustomer
							showTopProject
						/>

						<ProjectReportPreview
							ref={projectReportPreviewRef}
							data={projectResults.value}
							from={from}
							to={to}
						/>

						{projectResults.value.length > 0 && (
							<GroupByList data={projectResults} from={from} to={to} />
						)}
					</div>
				)}
			</>
		);
	}
);
