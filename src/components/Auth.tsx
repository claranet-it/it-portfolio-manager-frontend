import { $, component$, useTask$ } from '@builder.io/qwik';
import { auth0 } from '../app';
import { navigateTo } from '../router';
import { getAuthToken, setAuthToken } from '../utils/token';
import { removeCookie, setCookie } from '../utils/cookie';
import { CHATBOT_COOKIE_KEY } from '../utils/constants';

export const Auth = component$(() => {
	const goToEffort = $(() => navigateTo('effort'));

	useTask$(async () => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		if (code) {
			await auth0.getTokenSilently({ cacheMode: 'off' });
			const token = await auth0.getIdTokenClaims();
			if (token) {
				await setAuthToken(token.__raw);
				setCookie(CHATBOT_COOKIE_KEY, token.__raw);
				goToEffort();
			}
		} else {
			if (!(await getAuthToken())) {
				removeCookie(CHATBOT_COOKIE_KEY);
				auth0.loginWithRedirect();
			} else {
				goToEffort();
			}
		}
	});
	return <div />;
});
