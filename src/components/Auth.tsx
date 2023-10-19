import { $, component$, useContext, useTask$ } from '@builder.io/qwik';
import { AppContext, auth0 } from '../app';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, setCookie } from '../utils/cookie';

export const Auth = component$(() => {
	const appStore = useContext(AppContext);

	const goToProfile = $(() => {
		appStore.route = 'PROFILE';
	});

	useTask$(async () => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		if (code) {
			await auth0.getTokenSilently({ cacheMode: 'off' });
			const token = await auth0.getIdTokenClaims();
			if (token) {
				setCookie(COOKIE_TOKEN_KEY, token.__raw);
				goToProfile();
			}
		} else {
			if (!getCookie(COOKIE_TOKEN_KEY)) {
				auth0.loginWithRedirect();
			} else {
				goToProfile();
			}
		}
	});
	return <div />;
});
