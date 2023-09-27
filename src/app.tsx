import { Auth0Client } from '@auth0/auth0-spa-js';
import { component$ } from '@builder.io/qwik';
import { Router, RouterConfig, initRouter } from 'qwik-router';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Profile } from './components/Profile';

export const auth0 = new Auth0Client({
	domain: 'iam.clara.net',
	clientId: 'S8a16tq1dnnqsUPr5q8x7zRUHgQgDVpT',
	authorizationParams: {
		redirect_uri: 'https://main.dh81w1al6xzzw.amplifyapp.com',
		audience: 'https://it-portfolio-api',
	},
});

const routes: RouterConfig = [
	{ path: '/', component: Home },
	{ path: '/login', component: Login },
	{ path: '/profile', component: Profile },
];

export const App = component$(() => {
	initRouter(window.location.href);

	return <Router routes={routes} />;
});
