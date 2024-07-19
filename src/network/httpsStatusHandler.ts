import { t } from 'src/locale/labels';
import { removeAuthToken } from '../utils/token';

export const httpStatusHandler = async (response: Response) => {
	switch (response.status) {
		case 401:
			await removeAuthToken();
			window.location.replace('auth?msg=401');
			break;
		case 500:
			//TODO: launch event
			console.log(t('GENERIC_BE_ERROR'));
			break;
		default:
			return response;
	}
};
