import { COOKIE_TOKEN_KEY } from './constants';
import { getCookie } from './cookie';
import {
	Configuration,
	SetUserProfile,
	Skill,
	SkillMatrix,
	UserMe,
} from './types';

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
	return response.status === 200 ? await response.json() : null;
};

export const getSkillMatrixMine = async (): Promise<Skill[]> => {
	const headers = getHeaders();
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/skill-matrix/mine`,
		{ method: 'GET', headers }
	);
	return await response.json();
};

export const pathSkillMatrixMine = async (skill: Skill): Promise<boolean> => {
	const headers = getHeaders();
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/skill-matrix/mine`,
		{ method: 'PATCH', headers, body: JSON.stringify(skill) }
	);
	return response.status === 204;
};

export const getSkills = async (): Promise<SkillMatrix> => {
	const company = 'it';
	const headers = getHeaders();
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/skill-matrix?company=${company}`,
		{ method: 'GET', headers }
	);
	return response.status === 200 ? await response.json() : null;
};
