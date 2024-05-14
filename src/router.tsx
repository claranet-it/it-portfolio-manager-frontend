import { Signal, useSignal, useTask$ } from '@builder.io/qwik';
import { Auth } from './components/Auth';
import { Effort } from './page/Effort';
import { Profile } from './page/Profile';
import { Search } from './page/Search';
import { Skills } from './page/Skills';
import { Timesheet } from './page/Timesheet';

export type Route = keyof typeof routes;

export const routes = {
	auth: <Auth />,
	effort: <Effort />,
	timesheet: <Timesheet />,
	profile: <Profile />,
	skills: <Skills />,
	search: <Search />,
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
