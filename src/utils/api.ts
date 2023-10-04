import { COOKIE_TOKEN_KEY } from './constants';
import { getCookie } from './cookie';
import { Configuration, SetUserProfile, UserMe } from './types';

const getHeaders = () => {
	const token = getCookie(COOKIE_TOKEN_KEY);
	return new Headers({
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	});
};
export const getUserMe = async (): Promise<UserMe> => {
	const headers = getHeaders();
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/user/me`,
		{ method: 'GET', headers }
	);
	return await response.json();
};

export const setUserProfile = async (
	body: SetUserProfile
): Promise<boolean> => {
	const headers = getHeaders();
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
		{ method: 'POST', headers, body: JSON.stringify(body) }
	);
	return response.status === 201;
};

export const getConfiguration = async (): Promise<Configuration> => {
	const headers = getHeaders();
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/configuration`,
		{ method: 'GET', headers }
	);
	return await response.json();
};
