import { Auth0Client } from '@auth0/auth0-spa-js';
import {
	component$,
	createContextId,
	useContextProvider,
	useStore,
} from '@builder.io/qwik';
import { Home } from './components/Home';
import { Profile } from './components/Profile';
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
	isLogged: false,
	configuration: {
		crews: [],
		skills: [],
		scoreRange: {
			min: 0,
			max: 0,
		},
	},
};

export const App = component$(() => {
	const appStore = useStore<AppStore>(initialState);
	useContextProvider(AppContext, appStore);
	return appStore.isLogged ? <Profile /> : <Home />;
});
