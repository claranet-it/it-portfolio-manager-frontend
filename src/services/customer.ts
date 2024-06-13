import { Customer } from '../models/Customer';
import { getHttpResponse } from '../network/httpRequest';

export const getCustomers = async (company: string = 'it'): Promise<Customer[]> =>
	getHttpResponse<Customer[]>(`task/customer?company=${company}`);
