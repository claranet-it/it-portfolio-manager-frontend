import { BusinessCardData } from '@models/businessCard';
import { checkHttpResponseStatus, getHttpResponse } from 'src/network/httpRequest';

export const getMyBusinessCardData = async (): Promise<BusinessCardData> =>
	getHttpResponse<BusinessCardData>('business-card');

export const saveMyBusinessCardData = async (data: BusinessCardData): Promise<boolean> =>
	checkHttpResponseStatus('business-card', 201, 'POST', data);
