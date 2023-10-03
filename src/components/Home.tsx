import { $, component$, useContext, useTask$ } from '@builder.io/qwik';
import { useNavigate } from 'qwik-router';
import { AppContext, auth0 } from '../app';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, setCookie } from '../utils/cookie';

export const Home = component$(() => {
	const navigate = useNavigate();
	const appStore = useContext(AppContext);

	const goToProfile = $(() => {
		appStore.isLogged = true;
		navigate('/profile');
	});

	useTask$(async () => {
		const url = new URL(window.location.href);
		const code = url.searchParams.get('code');
		if (code) {
			const token = await auth0.getTokenSilently();
			if (token) {
				setCookie(COOKIE_TOKEN_KEY, token);
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
