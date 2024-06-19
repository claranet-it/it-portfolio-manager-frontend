import { Effort, EffortMatrix } from '@models/effort';
import { Month } from '@models/month';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getEffort = async (
	months: number = 3,
	company: string = 'it'
): Promise<EffortMatrix> => [
	...(await getMyCompanyEffort(months, company)),
	...(await getNetowrkingEffort(months, company)),
];

const getMyCompanyEffort = async (
	months: number = 3,
	company: string = 'it'
): Promise<EffortMatrix> =>
	getHttpResponse<EffortMatrix>(`effort/next?months=${months}&company=${company}`);

const getNetowrkingEffort = async (
	months: number = 3,
	company: string = 'it'
): Promise<EffortMatrix> => {
	try {
		let response = await getHttpResponse<EffortMatrix>(
			`networking/effort/next?months=${months}&company=${company}`
		);

		// Reassigning duplicate items based on company skills
		response = response.reduce((acc, item) => {
			const [[companyName, skillList]] = Object.entries(item);
			const list = skillList as unknown as Effort[];
			list.forEach((effort) => {
				effort.isCompany = true;
				acc.push({
					[companyName]: effort,
				});
			});
			return acc;
		}, [] as EffortMatrix);

		return Promise.resolve(response);
	} catch (error) {
		const errorMessage = (error as Error).message;
		return Promise.reject(errorMessage);
	}
};

export const putEffort = async (
	uid: string,
	effort: Omit<Effort, 'effort'>,
	month: Month
): Promise<boolean> => checkHttpResponseStatus('effort', 204, 'PUT', { uid, ...effort, ...month });
