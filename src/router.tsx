import { Signal, useSignal, useTask$ } from '@builder.io/qwik';
import { AuthManager } from './pages/AuthManager';
import { Effort } from './pages/Effort';
import { Profile } from './pages/Profile';
import { Registry } from './pages/Registry';
import { Report } from './pages/Report';
import { Search } from './pages/Search';
import { Skills } from './pages/Skills';
import { Timesheet } from './pages/Timesheet';

export type Route = keyof typeof routes;

export const routes = {
	auth: <AuthManager />,
	effort: <Effort />,
	timesheet: <Timesheet />,
	report: <Report />,
	profile: <Profile />,
	skills: <Skills />,
	search: <Search />,
	registry: <Registry />,
};

export const navigateTo = (route: Route): void => {
	window.history.pushState({}, '', route);
	dispatchEvent(new PopStateEvent('popstate'));
};

const getCurrentRoute = (): Route => window.location.pathname.replaceAll('/', '') as Route;

export const useRouter = (defaultRoute: Route = 'auth'): Signal<Route> => {
	const currentRouteSignal = useSignal<Route>(defaultRoute);

	useTask$(() => {
		window.onpopstate = () => (currentRouteSignal.value = getCurrentRoute());
		const route = getCurrentRoute();
		if (route === currentRouteSignal.value) return;
		if (Object.keys(routes).includes(route)) {
			currentRouteSignal.value = route;
		} else if (route) {
			window.history.replaceState({}, '', `/${defaultRoute}`);
		}
	});

	return currentRouteSignal;
};
