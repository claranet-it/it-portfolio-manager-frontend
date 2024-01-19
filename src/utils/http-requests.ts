import { COOKIE_TOKEN_KEY } from './constants';
import { getCookie } from './cookie';

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH';

const getHeaders = () => {
	const token = getCookie(COOKIE_TOKEN_KEY);
	return new Headers({
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	});
};

const executeRequest = async (path: string, method: HttpMethods = 'GET', body?: Object) => {
	const headers = getHeaders();
	const options: RequestInit = {
		method,
		headers,
		body: JSON.stringify(body),
	};
	return await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${path}`, options);
};

export const getHttpResponse = async <Response>(
	path: string,
	method?: HttpMethods,
	body?: Object
): Promise<Response> => {
	const response = await executeRequest(path, method, body);
	return response.status === 200 ? await response.json() : null;
};

export const checkHttpResponseStatus = async (
	path: string,
	expectedStatus: number = 204,
	method?: HttpMethods,
	body?: Object
): Promise<boolean> => {
	const { status } = await executeRequest(path, method, body);
	return status === expectedStatus;
};
