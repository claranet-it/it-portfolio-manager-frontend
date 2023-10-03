import { component$, useTask$ } from '@builder.io/qwik';
import { useNavigate } from 'qwik-router';
import { auth0 } from '../app';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, setCookie } from '../utils/cookie';

export const Home = component$(() => {
	const navigate = useNavigate();
	useTask$(async () => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		if (code) {
			const token = await auth0.getTokenSilently();
			if (token) {
				setCookie(COOKIE_TOKEN_KEY, token);
				navigate('/profile');
			}
		} else {
			!getCookie(COOKIE_TOKEN_KEY)
				? auth0.loginWithRedirect()
				: navigate('/profile');
		}
	});
	return <div />;
});
