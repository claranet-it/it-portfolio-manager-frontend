import { Customer } from '@models/customer';
import { Project, ProjectType } from '@models/project';
import { ReportParamsFilters, ReportProductivityItem, ReportTimeEntry } from '@models/report';
import { Task } from '@models/task';
import { TimeEntry } from '@models/timeEntry';
import { getHttpResponse } from 'src/network/httpRequest';
import { decryptCustomer, decryptString } from 'src/utils/cipher-entities';
import { UUID } from 'src/utils/uuid';

export const getProductivity = async (
	customer: Customer | null,
	project: Project | null,
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
			...(project !== null && { project: project.id }),
			...(task !== null && { task: task.id }),
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
	task: {
		id: string;
		name: string;
	};
	email: string;
	projectType: ProjectType;
	plannedHours: number;
	crew: string;
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

	return Promise.all(
		response.map(async (entry) => ({
			...entry,
			customer: await decryptCustomer(entry.customer),
			description: entry.description
				? await decryptString(entry.description)
				: entry.description,
			project: {
				id: entry.project.id,
				name: await decryptString(entry.project.name),
				plannedHours: entry.plannedHours,
				type: entry.projectType,
				completed: false,
			},
			task: {
				id: entry.task.id,
				name: await decryptString(entry.task.name),
				plannedHours: 0,
				completed: false,
			},
			email: entry.email === '' ? UUID() : entry.email,
		}))
	);
};

export const getReportProjectsFilterBy = async (
	params: ReportParamsFilters
): Promise<ReportTimeEntry[]> => {
	const response = await getHttpResponse<getTimeEntryResponse[]>(
		'report/projects',
		'POST',
		params
	);

	return Promise.all(
		response.map(async (entry) => ({
			...entry,
			customer: await decryptCustomer(entry.customer),
			description: entry.description
				? await decryptString(entry.description)
				: entry.description,
			project: {
				id: entry.project.id,
				name: await decryptString(entry.project.name),
				plannedHours: entry.plannedHours,
				type: entry.projectType,
				completed: false,
			},
			task: {
				id: entry.task.id,
				name: await decryptString(entry.task.name),
				plannedHours: 0,
				completed: false,
			},
			email: entry.email === '' ? UUID() : entry.email,
		}))
	);
};
