import { $, useSignal, useTask$ } from '@builder.io/qwik';
import { AuthProviderButton, Provider } from '@models/auth';
import { CHATBOT_COOKIE_KEY } from 'src/utils/constants';
import { removeCookie, setCookie } from 'src/utils/cookie';
import { auth0 } from '../app';
import { navigateTo } from '../router';
import { getAuthValidation } from '../services/auth';
import { getProvider, removeProvider, setProvider } from '../utils/provider';
import { getAuthToken, setAuthToken } from '../utils/token';

export const useAuth = () => {
	const selectedProvider = useSignal<Provider | undefined>(undefined);
	const isLoading = useSignal<boolean>(false);

	const goToTimesheet = $(() => navigateTo('timesheet'));
	const refreshPage = $(() => navigateTo('auth'));

	const authProviders: AuthProviderButton[] = [
		{
			name: 'Claranet',
			onClick: $(() => (selectedProvider.value = 'Claranet')),
		},
		{
			name: 'Google',
			onClick: $(() => (selectedProvider.value = 'Google')),
		},
	];

	const handleBricklyToken = $(async (provider: Provider, providerToken: string) => {
		isLoading.value = true;
		const response = await getAuthValidation(provider, providerToken);
		isLoading.value = false;

		if (response.token) {
			await setAuthToken(response.token);
			setCookie(CHATBOT_COOKIE_KEY, response.token);
			goToTimesheet();
		} else {
			refreshPage();
		}
	});

	const handleClaranetAuth = $(async () => {
		await auth0.getTokenSilently({ cacheMode: 'off' });
		const token = await auth0.getIdTokenClaims();

		if (token) {
			await handleBricklyToken('Claranet', token.__raw);
		}
	});

	const handleGoogleAuth = $(async (token: string | null) => {
		if (token) {
			await handleBricklyToken('Google', token);
		}
	});

	const redirectToGoogleAuth = $(() => {
		window.location.replace(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`);
	});

	useTask$(async () => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		const token = url.searchParams.get('token');
		const provider = await getProvider();

		if (code || token) {
			selectedProvider.value = provider;
		} else {
			await removeProvider();
		}
	});

	useTask$(async ({ track }) => {
		const provider = track(() => selectedProvider.value);
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		const token = url.searchParams.get('token');

		if (code || token) {
			switch (provider) {
				case 'Claranet': {
					handleClaranetAuth();
					break;
				}
				case 'Google': {
					handleGoogleAuth(token);
					break;
				}
				default: {
					await removeProvider();
					refreshPage();
					break;
				}
			}
		} else {
			if (!(await getAuthToken())) {
				removeCookie(CHATBOT_COOKIE_KEY);

				if (provider) {
					await setProvider(provider);

					switch (provider) {
						case 'Claranet': {
							auth0.loginWithRedirect();
							break;
						}
						case 'Google': {
							redirectToGoogleAuth();
							break;
						}
					}
				} else {
					await removeProvider();
				}
			} else {
				await removeProvider();
				goToTimesheet();
			}
		}
	});

	return {
		authProviders,
		isLoading,
	};
};
