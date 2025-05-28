import { Customer } from '@models/customer';
import { Project, ProjectType } from '@models/project';
import { ReportParamsFilters, ReportProductivityItem, ReportTimeEntry } from '@models/report';
import { TimeEntry } from '@models/timeEntry';
import { getHttpResponse } from 'src/network/httpRequest';
import { UUID } from 'src/utils/uuid';

export const getProductivity = async (
	customer: Customer | null,
	project: Project | null,
	task: string,
	name: string,
	from: string,
	to: string
): Promise<ReportProductivityItem[]> => {
	return getHttpResponse<ReportProductivityItem[]>({
		path: `report/productivity`,
		params: {
			from,
			to,
			...(customer !== null && { customer: customer.id }),
			...(project !== null && { project: project.id }),
			...(task !== '' && { task: task }),
			...(name !== '' && { name: name }),
		},
	});
};

// TODO: Remove after BE has been updated with correct project type
type getTimeEntryResponse = Omit<TimeEntry, 'task' | 'isUnsaved' | 'index' | 'project'> & {
	project: {
		id: string;
		name: string;
	};
	email: string;
	projectType: ProjectType;
	plannedHours: number;
	crew: string;
	task: string;
};

export const getReportTimeEntry = async (from: string, to: string): Promise<ReportTimeEntry[]> => {
	const response = await getHttpResponse<getTimeEntryResponse[]>({
		path: `report/time-entries`,
		params: {
			from,
			to,
			format: 'json',
		},
	});

	return response.map((entry) => {
		return {
			...entry,
			project: {
				id: entry.project.id,
				name: entry.project.name,
				plannedHours: entry.plannedHours,
				type: entry.projectType,
				completed: false,
			},
			task: {
				name: entry.task,
				plannedHours: 0,
				completed: false,
			},
			email: entry.email === '' ? UUID() : entry.email,
		};
	});
};

export const getReportProjectsFilterBy = async (
	params: ReportParamsFilters
): Promise<ReportTimeEntry[]> => {
	const response = await getHttpResponse<getTimeEntryResponse[]>(
		'report/projects',
		'POST',
		params
	);

	return response.map((entry) => {
		return {
			...entry,
			project: {
				id: entry.project.id,
				name: entry.project.name,
				plannedHours: entry.plannedHours,
				type: entry.projectType,
				completed: false,
			},
			task: {
				name: entry.task,
				plannedHours: 0,
				completed: false,
			},
			email: entry.email === '' ? UUID() : entry.email,
		};
	});
};
