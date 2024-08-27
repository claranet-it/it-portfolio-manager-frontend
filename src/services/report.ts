import { Customer } from '@models/customer';
import { Project, ProjectType } from '@models/project';
import { ReportProductivityItem, ReportTimeEntry } from '@models/report';
import { Task } from '@models/task';
import { TimeEntry } from '@models/timeEntry';
import { getHttpResponse } from 'src/network/httpRequest';
import { UUID } from 'src/utils/uuid';

export const getProductivity = async (
	customer: Customer,
	project: Project,
	task: Task,
	name: string,
	from: string,
	to: string
): Promise<ReportProductivityItem[]> => {
	return getHttpResponse<ReportProductivityItem[]>({
		path: `report/productivity`,
		params: {
			from,
			to,
			...(customer !== '' && { customer: customer }),
			...(project.name !== '' && { project: project.name }),
			...(task !== '' && { task: task }),
			...(name !== '' && { name: name }),
		},
	});
};

// TODO: Remove after BE has been updated with correct project type
type getTimeEntryResponse = Omit<TimeEntry, 'isUnsaved' | 'index' | 'project'> & {
	email: string;
	project: string;
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

	return response.map((entry) => {
		return {
			...entry,
			project: {
				name: entry.project,
				plannedHours: entry.plannedHours,
				type: entry.projectType,
			},
			email: entry.email === '' ? UUID() : entry.email,
		};
	});
};
