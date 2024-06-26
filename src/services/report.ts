import { ReportProductivityItem } from '@models/report';
import { getHttpResponse } from 'src/network/httpRequest';

export const getProductivity = async (
	from: string,
	to: string
): Promise<ReportProductivityItem[]> =>
	getHttpResponse<ReportProductivityItem[]>(`report/productivity?from=${from}&to=${to}`);
