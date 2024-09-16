import { SetUserProfile, UserMe, UserProfile } from '@models/user';
import { checkHttpResponseStatus, getHttpResponse } from '../network/httpRequest';

export const getUserMe = async (): Promise<UserMe> => getHttpResponse<UserMe>('user/me');

export const setUserProfile = async (body: SetUserProfile): Promise<boolean> =>
	checkHttpResponseStatus('user/profile', 201, 'POST', body);

export const getUserProfiles = async (): Promise<UserProfile[]> =>
	getHttpResponse<UserProfile[]>('user/list');
