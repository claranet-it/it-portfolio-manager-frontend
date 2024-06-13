import { Auth0Client } from '@auth0/auth0-spa-js';
import {
	component$,
	createContextId,
	useContextProvider,
	useStore,
	useTask$,
	useVisibleTask$,
} from '@builder.io/qwik';
import { initFlowbite } from 'flowbite';
import { Layout } from './components/Layout';
import { routes, useRouter } from './router';
import { AppStore } from './models/configurations';
import { getAuthToken } from './utils/token';
import { getConfiguration } from './services/configuration';

const {
	VITE_AUTH_DOMAIN: domain,
	VITE_AUTH_CLIENTID: clientId,
	VITE_AUTH_REDIRECT_URI: redirect_uri,
	VITE_AUTH_AUDIENCE: audience,
} = import.meta.env;
export const auth0 = new Auth0Client({
	domain,
	clientId,
	authorizationParams: {
		redirect_uri,
		audience,
		prompt: 'login',
	},
});

export const AppContext = createContextId<AppStore>('AppStore');

const initialState: AppStore = {
	configuration: {
		company: 'it',
		crews: [],
		skills: {},
		scoreRange: {
			min: 0,
			max: 0,
		},
		scoreRangeLabels: [],
	},
	events: [],
};

export const App = component$(() => {
	const appStore = useStore<AppStore>(initialState);
	const currentRouteSignal = useRouter();

	useContextProvider(AppContext, appStore);

	useVisibleTask$(({ track }) => {
		// on change route
		track(currentRouteSignal);
		// run this
		initFlowbite();
	});

	useTask$(async () => {
		if ((await getAuthToken()) != null) {
			const configuration = await getConfiguration();
			appStore.configuration = configuration;
		}
	});

	return currentRouteSignal.value === 'auth' ? (
		routes[currentRouteSignal.value]
	) : (
		<Layout currentRoute={currentRouteSignal.value}>{routes[currentRouteSignal.value]}</Layout>
	);
});
