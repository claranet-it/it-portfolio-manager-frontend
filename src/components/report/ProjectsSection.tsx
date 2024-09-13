import { component$, Signal, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Project } from '@models/project';
import { RepotTab } from '@models/report';
import { Task } from '@models/task';
import { useReportProject } from 'src/hooks/report/useReportProject';
import { GroupByList } from './GropuByList';
import { ProjectReportDetails } from './ProjectReportDetails';
import { ProjectReportPreview } from './ProjectReportPreview';
import { ReportHeader } from './ReportHeader';

interface ReportProps {
	selectedCustomerSig: Signal<string[]>;
	selectedProjectSig: Signal<Project[]>;
	selectedTaskSig: Signal<Task[]>;
	selectedNameSig: Signal<string>;
	selectedTab: Signal<RepotTab>;
	to: Signal<Date>;
	from: Signal<Date>;
}

export const ProjectsSection = component$<ReportProps>(
	({
		to,
		from,
		selectedCustomerSig,
		selectedProjectSig,
		selectedTaskSig,
		selectedNameSig,
		selectedTab,
	}) => {
		const projectReportDetailsRef = useSignal<HTMLElement>();
		const projectReportPreviewRef = useSignal<HTMLElement>();

		const showProjectsDetails = useSignal(false);

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
				selectedCustomerSig.value.length !== 0 ||
				selectedProjectSig.value.length !== 0 ||
				selectedTaskSig.value.length !== 0 ||
				selectedNameSig.value !== '';
		});

		return (
			<>
				{showProjectsDetails.value ? (
					<div class='flex flex-col gap-1'>
						<ReportHeader
							printableComponent={projectReportDetailsRef}
							customer={selectedCustomerSig}
							data={projectResults.value}
						/>

						<ProjectReportDetails
							ref={projectReportDetailsRef}
							data={projectResults.value}
							from={from}
							to={to}
						/>

						{projectResults.value.length > 0 && <GroupByList data={projectResults} />}
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

						{projectResults.value.length > 0 && <GroupByList data={projectResults} />}
					</div>
				)}
			</>
		);
	}
);
