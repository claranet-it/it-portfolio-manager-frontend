import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { setCookie } from '../utils/cookie';

export const Auth = component$(() => {
	useVisibleTask$(async () => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		setCookie('token', 'abc');
		// if (code) {
		// 	const token = await auth0.getIdTokenClaims();
		// 	if (token) {
		// setCookie('token', token.__raw);
		// 	}
		// 	window.location.href = '/';
		// }
	});
	return <div />;
});
