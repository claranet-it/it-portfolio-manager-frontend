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
	const options: RequestInit = {
		method,
		headers,
		body: JSON.stringify(body),
	};
	const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${path}`, options);
	return await httpResponseHandler(response);
};

const encodeParams = (params?: Record<string, string>): Record<string, string> => {
	if (!params) {
		return {};
	}

	const encodedParams: Record<string, string> = {};

	for (const key in params) {
		if (params.hasOwnProperty(key)) {
			encodedParams[key] = encodeURIComponent(params[key]);
		}
	}

	return encodedParams;
};

const requestPath = (path: { path: string; params?: Record<string, string> } | string) => {
	if (typeof path === 'string') {
		return path;
	}

	const { path: basePath, params } = path;
	const queryString = params ? `?${new URLSearchParams(encodeParams(params)).toString()}` : '';

	return `${basePath}${queryString}`;
};

export const getHttpResponse = async <Response>(
	path: { path: string; params?: Record<string, string> } | string,
	method?: HttpMethods,
	body?: Object
): Promise<Response> => {
	const response = await executeRequest(requestPath(path), method, body);
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
