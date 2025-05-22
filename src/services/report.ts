import { Customer } from '@models/customer';
import { ProjectType } from '@models/project';
import { ReportParamsFilters, ReportProductivityItem, ReportTimeEntry } from '@models/report';
import { TimeEntry } from '@models/timeEntry';
import { getHttpResponse } from 'src/network/httpRequest';
import { decryptString, encryptCustomer, encryptString } from 'src/utils/cipher-entities';
import { UUID } from 'src/utils/uuid';

export const getProductivity = async (
	customer: Customer,
	project: string,
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
			...(customer !== '' && { customer: await encryptCustomer(customer) }),
			...(project !== '' && { project: await encryptString(project) }),
			...(task !== '' && { task: await encryptString(task) }),
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

	return Promise.all(
		response.map(async (entry) => {
			return {
				...entry,
				customer: await decryptString(entry.customer),
				description: entry.description
					? await decryptString(entry.description)
					: entry.description,
				project: {
					name: await decryptString(entry.project),
					plannedHours: entry.plannedHours,
					type: entry.projectType,
					completed: false,
				},
				task: {
					name: await decryptString(entry.task),
					plannedHours: 0,
					completed: false,
				},
				email: entry.email === '' ? UUID() : entry.email,
			};
		})
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
			customer: await decryptString(entry.customer),
			description: entry.description
				? await decryptString(entry.description)
				: entry.description,
			project: {
				name: await decryptString(entry.project),
				plannedHours: entry.plannedHours,
				type: entry.projectType,
				completed: false,
			},
			task: {
				name: await decryptString(entry.task),
				plannedHours: 0,
				completed: false,
			},
			email: entry.email === '' ? UUID() : entry.email,
		}))
	);
};
