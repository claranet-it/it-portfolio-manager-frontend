import { SetUserProfile, UserMe, UserProfile } from '@models/user';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getUserMe = async (): Promise<UserMe> => getHttpResponse<UserMe>('user/me');

export const setUserProfile = async (body: SetUserProfile): Promise<boolean> =>
	checkHttpResponseStatus('user/profile', 201, 'POST', body);

export const getUserProfiles = async (): Promise<UserProfile[]> =>
	getHttpResponse<UserProfile[]>('user/list');

export const deactivateUser = async (userId: string): Promise<boolean> =>
	checkHttpResponseStatus(`user/${userId}`, 200, 'DELETE', {});

export const activateUser = async (userId: string): Promise<boolean> =>
	checkHttpResponseStatus(`user/reactivate-user/${userId}`, 200, 'POST', {});

export const editUserProfile = async (
	userId: string,
	crew: string,
	role: string
): Promise<boolean> =>
	checkHttpResponseStatus(`user/${userId}`, 200, 'PATCH', {
		crew: crew,
		role: role,
	});
