import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { auth0 } from '../app';
import { setCookie } from '../utils/cookie';

export const Auth = component$(() => {
	useVisibleTask$(async () => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		console.log('code', code);
		if (code) {
			const token = await auth0.getIdTokenClaims();
			console.log('code', JSON.stringify(token));
			if (token) {
				setCookie('token', token.__raw);
			}
			window.location.href = '/';
		}
	});
	return <div />;
});
