import { Auth0Client } from '@auth0/auth0-spa-js';
import {
	component$,
	createContextId,
	useContextProvider,
	useStore,
	useTask$,
	useVisibleTask$,
} from '@builder.io/qwik';
import { AppStore } from '@models/configurations';
import { initFlowbite } from 'flowbite';
import { CipherContext, CipherStore } from './cipherContext';
import { getRoleBasedMenu } from './components/Header';
import { Layout } from './components/Layout';
import { useCipher } from './hooks/useCipher';
import { addHttpErrorListener } from './network/httpResponseHandler';
import { isPublicRoute, routes, useRouter } from './router';
import { getConfiguration } from './services/configuration';
import { getACLValues, roleHierarchy } from './utils/acl';
import { Roles } from './utils/constants';
import { getAuthToken, removeAuthToken } from './utils/token';

const {
	VITE_AUTH_DOMAIN: domain,
	VITE_AUTH_CLIENTID: clientId,
	VITE_AUTH_AUDIENCE: audience,
} = import.meta.env;

const redirect_uri = window.location.origin;

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
	isLoading: false,
};

export const App = component$(() => {
	const currentRouteSignal = useRouter();

	const appStore = useStore<AppStore>(initialState);
	useContextProvider(AppContext, appStore);

	const cipherStore = useStore<CipherStore>({ cipher: { status: 'uninitialized' } });
	useContextProvider(CipherContext, cipherStore);

	const { initCipher } = useCipher();

	useVisibleTask$(({ track }) => {
		// on change route
		track(currentRouteSignal);
		// run this
		initFlowbite();
	});

	useTask$(async () => {
		if (isPublicRoute(currentRouteSignal.value)) return;

		const user = await getACLValues();

		const hasAccess = (item: { route: string; role?: Roles }) => {
			const requiredRole = item.role ?? 'USER';
			return (
				item.route === currentRouteSignal.value &&
				roleHierarchy[requiredRole] <= roleHierarchy[user.role]
			);
		};

		const status = await initCipher();
		if (status !== 'initialized') {
			currentRouteSignal.value = 'cipher';
			window.history.pushState({}, '', '/cipher');
			return;
		}

		const res = getRoleBasedMenu().find(hasAccess);

		if (!res) {
			currentRouteSignal.value = 'timesheet';
			window.history.pushState({}, '', '/timesheet');
		}
	});

	useTask$(async () => {
		if ((await getAuthToken()) != null) {
			const configuration = await getConfiguration();
			appStore.configuration = configuration;
		}
	});

	useTask$(() => {
		return addHttpErrorListener(async ({ status }) => {
			if (status !== 401) return;

			await removeAuthToken();
			window.location.replace('auth?msg=401');
		});
	});

	return isPublicRoute(currentRouteSignal.value) ? (
		routes[currentRouteSignal.value]
	) : (
		<Layout currentRoute={currentRouteSignal.value}>{routes[currentRouteSignal.value]}</Layout>
	);
});
