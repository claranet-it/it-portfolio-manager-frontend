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
	let params = `from=${from}&to=${to}`;
	if (customer !== '') params = params.concat(`&customer=${customer}`);
	if (project.name !== '') params = params.concat(`&project=${project}`);
	if (task !== '') params = params.concat(`&task=${task}`);
	if (name !== '') params = params.concat(`&name=${name}`);

	return getHttpResponse<ReportProductivityItem[]>(`report/productivity?${params}`);
};
