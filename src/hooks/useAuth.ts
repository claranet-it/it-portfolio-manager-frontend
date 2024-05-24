import { $, useSignal, useTask$ } from '@builder.io/qwik';
import { auth0 } from '../app';
import { getAuthToken, setAuthToken } from '../utils/token';
import { navigateTo } from '../router';
import { AuthProviderButton, Provider } from '../models/Auth';
import { getAuthValidation } from '../services/auth';
import { getProvider, removeProvider, setProvider } from '../utils/provider';

export const useAuth = () => {
	const selectedProvider = useSignal<Provider | undefined>(undefined);

	const goToEffort = $(() => navigateTo('effort'));
	const refreshPage = $(() => navigateTo('auth'));

	const authProviders: AuthProviderButton[] = [
		{
			name: 'Claranet',
			onClick: $(() => (selectedProvider.value = 'Claranet')),
			image: {
				alt: 'Claranet logo',
				src: '/logo.webp',
			},
		},
		{
			name: 'Google',
			onClick: $(() => (selectedProvider.value = 'Google')),
			image: {
				alt: 'Google logo',
				src: '/logo.webp',
			},
		},
	];

	const handleBricklyToken = $(async (provider: Provider, providerToken: string) => {
		const response = await getAuthValidation(provider, providerToken);

		if (response.token) {
			await setAuthToken(response.token);

			goToEffort();
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
				goToEffort();
			}
		}
	});

	return {
		authProviders,
	};
};
