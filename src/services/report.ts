import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { ReportProductivityItem } from '@models/report';
import { Task } from '@models/task';
import { getHttpResponse } from 'src/network/httpRequest';

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
			...(customer !== '' && { params: customer }),
			...(project.name !== '' && { project: project.name }),
			...(task !== '' && { task: task }),
			...(name !== '' && { name: name }),
		},
	});
};
