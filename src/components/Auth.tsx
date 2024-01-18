import { $, component$, useTask$ } from '@builder.io/qwik';
import { auth0 } from '../app';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, setCookie } from '../utils/cookie';
import { navigateTo } from '../utils/router';

export const Auth = component$(() => {
	const goToProfile = $(() => navigateTo('profile'));

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
