import { Customer } from '@models/customer';
import { ProjectType } from '@models/project';
import { ReportParamsFilters, ReportProductivityItem, ReportTimeEntry } from '@models/report';
import { Task } from '@models/task';
import { TimeEntry } from '@models/timeEntry';
import { getHttpResponse } from 'src/network/httpRequest';
import { UUID } from 'src/utils/uuid';

export const getProductivity = async (
	customer: Customer | null,
	project: string,
	task: Task | null,
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
			...(project !== '' && { project: project }),
			...(task !== null && { task: task.id }),
			...(name !== '' && { name: name }),
		},
	});
};

// TODO: Remove after BE has been updated with correct project type
type getTimeEntryResponse = Omit<TimeEntry, 'task' | 'isUnsaved' | 'index' | 'project'> & {
	email: string;
	project: string;
	projectType: ProjectType;
	plannedHours: number;
	crew: string;
	task: {
		id: string;
		name: string;
	};
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
				name: entry.project,
				plannedHours: entry.plannedHours,
				type: entry.projectType,
				completed: false,
			},
			task: {
				id: entry.task.id,
				name: entry.task.name,
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
				name: entry.project,
				plannedHours: entry.plannedHours,
				type: entry.projectType,
				completed: false,
			},
			task: {
				id: entry.task.id,
				name: entry.task.name,
				plannedHours: 0,
				completed: false,
			},
			email: entry.email === '' ? UUID() : entry.email,
		};
	});
};
