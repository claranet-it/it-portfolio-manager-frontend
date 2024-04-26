import { AUTH_TOKEN_KEY } from './constants';
import { clear, get, set } from './localStorage';

export const setAuthToken = async (value: string) => {
	await set(AUTH_TOKEN_KEY, value);
};

export const getAuthToken = async () => {
	return await get(AUTH_TOKEN_KEY);
};

export const removeAuthToken = async () => {
	await clear(AUTH_TOKEN_KEY);
};
