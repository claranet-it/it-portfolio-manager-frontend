import { UserMe, SetUserProfile } from '@models/user';
import { getHttpResponse, checkHttpResponseStatus } from '../network/httpRequest';

export const getUserMe = async (): Promise<UserMe> => getHttpResponse<UserMe>('user/me');

export const setUserProfile = async (body: SetUserProfile): Promise<boolean> =>
	checkHttpResponseStatus('user/profile', 201, 'POST', body);
