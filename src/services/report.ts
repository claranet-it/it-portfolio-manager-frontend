import { Customer } from '@models/customer';
import { Project, ProjectType } from '@models/project';
import { ReportProductivityItem, ReportTimeEntry } from '@models/report';
import { TimeEntry } from '@models/timeEntry';
import { getHttpResponse } from 'src/network/httpRequest';
import { CSV_REPORT_PROJECTS_FILE_NAME } from 'src/utils/constants';
import { UUID } from 'src/utils/uuid';

export const getProductivity = async (
	customer: Customer,
	project: Project,
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
			...(customer !== '' && { customer: customer }),
			...(project.name !== '' && { project: project.name }),
			...(task !== '' && { task: task }),
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

	return response.map((entry) => {
		return {
			...entry,
			project: {
				name: entry.project,
				plannedHours: entry.plannedHours,
				type: entry.projectType,
			},
			task: {
				// TODO: Remove after BE has fully implemented tasks
				name: entry.task,
				plannedHours: 0,
				completed: false,
			},
			email: entry.email === '' ? UUID() : entry.email,
		};
	});
};

export const downloadReportCSV = async (from: string, to: string) => {
	const response = await getHttpResponse<string>(
		{
			path: `report/time-entries`,
			params: {
				from,
				to,
				format: 'csv',
			},
		},
		'GET',
		undefined,
		true
	);

	const blob = new Blob([response as unknown as BlobPart], { type: 'text/csv' });
	const a = document.createElement('a');

	a.download = `${CSV_REPORT_PROJECTS_FILE_NAME}_${from}_${to}.csv`;
	a.href = URL.createObjectURL(blob);
	a.click();
	setTimeout(() => {
		URL.revokeObjectURL(a.href);
		a.remove();
	}, 200);
};
