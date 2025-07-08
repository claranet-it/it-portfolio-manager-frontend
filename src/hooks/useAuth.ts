import { $, useSignal, useTask$ } from '@builder.io/qwik';
import { AuthProviderButton, Provider } from '@models/auth';
import {
	AUTH_CREW_KEY,
	AUTH_ROLE_KEY,
	AUTH_USER_KEY,
	CHATBOT_COOKIE_KEY,
	Roles,
} from 'src/utils/constants';
import { removeCookie, setCookie } from 'src/utils/cookie';
import { set } from 'src/utils/localStorage/localStorage';
import { auth0 } from '../app';
import { navigateTo } from '../router';
import { getAuthValidation } from '../services/auth';
import { getUserMe } from '../services/user';
import { getProvider, removeProvider, setProvider } from '../utils/provider';
import { getAuthToken, setAuthToken } from '../utils/token';
import { useCipher } from './useCipher';

export const useAuth = () => {
	const selectedProvider = useSignal<Provider | undefined>(undefined);
	const isLoading = useSignal<boolean>(false);
	const issueMessage = useSignal<string | undefined>(undefined);
	const { initCipher } = useCipher();

	const refreshPage = $(() => navigateTo('auth'));
	const goToCompanyCodeManager = $(() => navigateTo('company-code'));
	const goToTimesheet = $(() => navigateTo('timesheet'));

	const authProviders: AuthProviderButton[] = [
		{
			name: 'Claranet',
			onClick: $(() => (selectedProvider.value = 'Claranet')),
		},
		{
			name: 'Google',
			onClick: $(() => (selectedProvider.value = 'Google')),
		},
		{
			name: 'Microsoft',
			onClick: $(() => (selectedProvider.value = 'Microsoft')),
		},
	];

	const handleBricklyToken = $(async (provider: Provider, providerToken: string) => {
		const response = await getAuthValidation(provider, providerToken);

		if (response.role) {
			await set(AUTH_ROLE_KEY, response.role);
		} else {
			await set(AUTH_ROLE_KEY, Roles.USER);
		}

		if (response.crew) {
			await set(AUTH_CREW_KEY, response.crew);
		}

		if (response.token) {
			await setAuthToken(response.token);
			setCookie(CHATBOT_COOKIE_KEY, response.token);
			isLoading.value = false;

			const status = await initCipher();
			if (status === 'initialized') {
				goToTimesheet();
			} else {
				goToCompanyCodeManager();
			}
		} else {
			refreshPage();
		}
	});

	const handleClaranetAuth = $(async () => {
		try {
			await auth0.getTokenSilently({ cacheMode: 'off' });
			const token = await auth0.getIdTokenClaims();

			if (token) {
				await handleBricklyToken('Claranet', token.__raw);
				const user = await getUserMe();
				set(AUTH_USER_KEY, JSON.stringify(user));
			}
		} catch (error) {
			console.log('claranet-authentication', error);
			throw new Error('cookies-disabled');
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

	const handleMicrosoftAuth = $(async (token: string | null) => {
		if (token) {
			await handleBricklyToken('Microsoft', token);
		}
	});

	const redirectToMicrosoftAuth = $(() => {
		window.location.replace(`${import.meta.env.VITE_BACKEND_URL}/api/auth/microsoft`);
	});

	useTask$(async () => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		const token = url.searchParams.get('token');
		const provider = await getProvider();

		if (code || token) {
			selectedProvider.value = provider;
		} else if (provider !== undefined) {
			await removeProvider();
			isLoading.value = false;
		}
	});

	useTask$(async ({ track }) => {
		const provider = track(() => selectedProvider.value);
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		const token = url.searchParams.get('token');

		if (code || token) {
			// after redirect
			isLoading.value = true;
			try {
				switch (provider) {
					case 'Claranet': {
						await handleClaranetAuth();
						break;
					}
					case 'Google': {
						await handleGoogleAuth(token);
						break;
					}
					case 'Microsoft': {
						await handleMicrosoftAuth(token);
						break;
					}
					default: {
						await removeProvider();
						isLoading.value = false;
						refreshPage();
						break;
					}
				}
			} catch (error) {
				isLoading.value = false;
				const errorMessage = (error as Error).message;
				console.error(error);
				if (errorMessage === 'cookies-disabled') {
					issueMessage.value = 'Please enable cookies for this app';
				}
			}
		} else {
			// user no authorized
			if (!(await getAuthToken())) {
				removeCookie(CHATBOT_COOKIE_KEY);

				if (provider) {
					await setProvider(provider);

					switch (provider) {
						case 'Claranet': {
							await auth0.loginWithRedirect();
							break;
						}
						case 'Google': {
							redirectToGoogleAuth();
							break;
						}
						case 'Microsoft': {
							redirectToMicrosoftAuth();
							break;
						}
					}
					isLoading.value = false;
				} else {
					await removeProvider();
					isLoading.value = false;
				}
			} else {
				await removeProvider();
				isLoading.value = false;

				const status = await initCipher();
				if (status === 'initialized') {
					goToTimesheet();
				} else {
					goToCompanyCodeManager();
				}
			}
		}
	});

	return {
		authProviders,
		isLoading,
		issueMessage,
	};
};
