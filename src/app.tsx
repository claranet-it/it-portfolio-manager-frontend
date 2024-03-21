import { Auth0Client } from '@auth0/auth0-spa-js';
import {
	component$,
	createContextId,
	useContextProvider,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { initFlowbite } from 'flowbite';
import { Layout } from './components/Layout';
import { routes, useRouter } from './utils/router';
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

export const AppContext = createContextId<AppStore>('AppStore');

const initialState: AppStore = {
	configuration: {
		crews: [],
		skills: {},
		scoreRange: {
			min: 0,
			max: 0,
		},
		scoreRangeLabels: [],
	},
};

export const App = component$(() => {
	const appStore = useStore<AppStore>(initialState);
	useContextProvider(AppContext, appStore);
	const currentRouteSignal = useRouter();

	useVisibleTask$(() => {
		initFlowbite();
	});

	return currentRouteSignal.value === 'auth' ? (
		routes[currentRouteSignal.value]
	) : (
		<Layout currentRoute={currentRouteSignal.value}>{routes[currentRouteSignal.value]}</Layout>
	);
});
