import { $, component$, useTask$ } from '@builder.io/qwik';
import { auth0 } from '../app';
import { navigateTo } from '../router';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, setCookie } from '../utils/cookie';

export const Auth = component$(() => {
	const goToEffort = $(() => navigateTo('effort'));

	useTask$(async () => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		if (code) {
			await auth0.getTokenSilently({ cacheMode: 'off' });
			const token = await auth0.getIdTokenClaims();
			if (token) {
				setCookie(COOKIE_TOKEN_KEY, token.__raw);
				goToEffort();
			}
		} else {
			if (!getCookie(COOKIE_TOKEN_KEY)) {
				auth0.loginWithRedirect();
			} else {
				goToEffort();
			}
		}
	});
	return <div />;
});
