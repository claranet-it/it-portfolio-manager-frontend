import { getAuthToken } from '../utils/token';
import { httpResponseHandler } from './httpResponseHandler';

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const getHeaders = async () => {
	const token = await getAuthToken();
	return new Headers({
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	});
};

const executeRequest = async (path: string, method: HttpMethods = 'GET', body?: Object) => {
	const headers = await getHeaders();
	if (method === 'DELETE' && !body) {
		headers.delete('Content-Type');
	}
	const options: RequestInit = {
		method,
		headers,
		body: JSON.stringify(body),
	};
	return await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${path}`, options);
};

const requestPath = (path: { path: string; params?: Record<string, string> } | string) => {
	if (typeof path === 'string') {
		return path;
	}

	const { path: basePath, params } = path;
	const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';

	return `${basePath}${queryString}`;
};

export const multipartHttpRequest = async (
	path: string,
	method: HttpMethods = 'POST',
	body: FormData
) => {
	const token = await getAuthToken();
	const options: RequestInit = {
		method,
		headers: new Headers({
			Authorization: `Bearer ${token}`,
		}),
		body,
	};
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${path}`, options);
	return await httpResponseHandler(response);
};

export const getHttpResponseWithStatus = async <T>(
	path: { path: string; params?: Record<string, string> } | string,
	method?: HttpMethods,
	body?: Object,
	plain?: boolean
): Promise<{
	response: T;
	status: number;
}> => {
	const response = await executeRequest(requestPath(path), method, body);
	const handledResponse = await httpResponseHandler(response);

	return {
		response: plain ? await handledResponse?.text() : await handledResponse?.json(),
		status: response.status,
	};
};

export const getHttpResponse = async <Response>(
	path: { path: string; params?: Record<string, string> } | string,
	method?: HttpMethods,
	body?: Object,
	plain?: boolean
): Promise<Response> => {
	const response = await httpResponseHandler(
		await executeRequest(requestPath(path), method, body)
	);
	return plain ? await response?.text() : await response?.json();
};

export const checkHttpResponseStatus = async (
	path: string,
	expectedStatus: number = 204,
	method?: HttpMethods,
	body?: Object
): Promise<boolean> => {
	const response = await httpResponseHandler(await executeRequest(path, method, body));

	if (response?.status === 400 && expectedStatus !== 400) {
		const { message } = await response.json();
		throw new Error(message);
	}
	return response?.status === expectedStatus;
};
