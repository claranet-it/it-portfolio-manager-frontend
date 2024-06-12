import { BricklyTokenResponse, Provider, TokenConfiguration } from '../models/Auth';
import { getHttpResponse } from '../network/httpRequest';

export const getAuthValidation = async (
	provider: Provider,
	providerToken: string
): Promise<BricklyTokenResponse> =>
	getHttpResponse<BricklyTokenResponse>('auth', 'POST', {
		provider: provider,
		token: providerToken,
	} as TokenConfiguration);
