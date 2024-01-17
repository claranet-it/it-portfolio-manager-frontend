import { $, component$, useVisibleTask$ } from '@builder.io/qwik';

import { useNavigate } from '@builder.io/qwik-city';
import { auth0 } from '~/routes/layout';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, setCookie } from '../utils/cookie';

export default component$(() => {
	const navigate = useNavigate();

	const goToProfile = $(() => {
		navigate('/profile');
	});

	useVisibleTask$(async () => {
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
