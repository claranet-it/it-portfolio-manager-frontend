import { Provider } from '../models/Auth';
import { clear, get, set } from './localStorage/localStorage';

export const setProvider = async (provider: Provider) => await set('provider', provider);

export const removeProvider = async () => await clear('provider');

export const getProvider = async () => {
	const provider = await get('provider');

	removeProvider();

	if (provider) {
		return provider as Provider;
	}
};
