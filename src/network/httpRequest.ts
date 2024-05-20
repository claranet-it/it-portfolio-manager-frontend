import { getAuthToken } from '../utils/token';
import { httpStatusHandler } from './httpsStatusHandler';

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH';

const getHeaders = async () => {
	const token = await getAuthToken();
	return new Headers({
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	});
};

const executeRequest = async (path: string, method: HttpMethods = 'GET', body?: Object) => {
	const headers = await getHeaders();
	const options: RequestInit = {
		method,
		headers,
		body: JSON.stringify(body),
	};
	const reqeust = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${path}`, options);
	return await httpStatusHandler(reqeust);
};

export const getHttpResponse = async <Response>(
	path: string,
	method?: HttpMethods,
	body?: Object
): Promise<Response> => {
	const response = await executeRequest(path, method, body);
	return await response?.json();
};

export const checkHttpResponseStatus = async (
	path: string,
	expectedStatus: number = 204,
	method?: HttpMethods,
	body?: Object
): Promise<boolean> => {
	const response = await executeRequest(path, method, body);

	if (response?.status === 400 && expectedStatus !== 400) {
		const { message } = await response.json();
		throw new Error(message);
	}
	return response?.status === expectedStatus;
};
