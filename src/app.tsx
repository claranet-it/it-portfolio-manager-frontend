import { Auth0Client } from '@auth0/auth0-spa-js';
import { component$ } from '@builder.io/qwik';
import { Router, RouterConfig, initRouter } from 'qwik-router';
import { Auth } from './components/Auth';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Profile } from './components/Profile';

const {
	VITE_AUTH_DOMAIN: domain,
	VITE_AUTH_CLIENTID: clientId,
	VITE_AUTH_REDIRECT_URI: redirect_uri,
	VITE_AUTH_AUDIENCE: audience,
} = import.meta.env;
export const auth0 = new Auth0Client({
	domain,
	clientId,
	authorizationParams: { redirect_uri, audience },
});

const routes: RouterConfig = [
	{ path: '/', component: Home },
	{ path: '/auth', component: Auth },
	{ path: '/login', component: Login },
	{ path: '/profile', component: Profile },
];

export const App = component$(() => {
	initRouter(window.location.href);

	return <Router routes={routes} />;
});
