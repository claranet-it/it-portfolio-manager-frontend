import { Auth0Client } from '@auth0/auth0-spa-js';
import {
	component$,
	createContextId,
	useContextProvider,
	useStore,
} from '@builder.io/qwik';
import { Router, RouterConfig, initRouter } from 'qwik-router';
import { Home } from './components/Home';
import { Profile } from './components/Profile';
import { AUTH_ROUTE, PROFILE_ROUTE } from './utils/constants';
import { AppStore } from './utils/types';

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
	{ path: AUTH_ROUTE, component: Home },
	{ path: PROFILE_ROUTE, component: Profile },
];
export const AppContext = createContextId<AppStore>('AppStore');

export const App = component$(() => {
	initRouter(window.location.href);
	useContextProvider(AppContext, useStore<AppStore>({}));
	return <Router routes={routes} />;
});
