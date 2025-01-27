import { Signal, useSignal, useTask$ } from '@builder.io/qwik';
import { AuthManager } from './pages/AuthManager';
import { ChartPreview } from './pages/ChartPreview';
import { Company } from './pages/Company';
import { Effort } from './pages/Effort';
import { Maintenance } from './pages/Maintenance';
import { Networking } from './pages/Networking';
import { People } from './pages/People';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Profile } from './pages/Profile';
import { Registry } from './pages/Registry';
import { Report } from './pages/Report';
import { Search } from './pages/Search';
import { Skills } from './pages/Skills';
import { Timesheet } from './pages/Timesheet';
import { isMaintenanceMode } from './utils/maintenance';

export type Route = keyof typeof routes;

export const routes = {
	auth: <AuthManager />,
	effort: <Effort />,
	timesheet: <Timesheet />,
	networking: <Networking />,
	report: <Report />,
	profile: <Profile />,
	company: <Company />,
	skills: <Skills />,
	search: <Search />,
	registry: <Registry />,
	chartpreview: <ChartPreview />,
	people: <People />,
	privacy_policy: <PrivacyPolicy />,
	maintenance: <Maintenance />,
};

export const navigateTo = (route: Route, params?: Record<string, string>): void => {
	const url = `/${route}${params ? `?${new URLSearchParams(params).toString()}` : ''}`;
	if (getCurrentRoute() === route) {
		window.location.search = params ? `?${new URLSearchParams(params).toString()}` : '';
	} else {
		window.history.pushState({}, '', url);
	}
	dispatchEvent(new PopStateEvent('popstate'));
};

export const getRouteParams = (): Record<string, string[]> => {
	const params = new URLSearchParams(window.location.search);
	const result: Record<string, string[]> = {};
	for (const [key, value] of params) {
		if (value.split(',').length > 1) {
			result[key] = value.split(',');
		} else {
			result[key] = [value];
		}
	}
	return result;
};

export const getCurrentRoute = (): Route => window.location.pathname.replaceAll('/', '') as Route;

export const useRouter = (defaultRoute: Route = 'auth'): Signal<Route> => {
	const currentRouteSignal = useSignal<Route>(defaultRoute);

	useTask$(() => {
		window.onpopstate = () => (currentRouteSignal.value = getCurrentRoute());
		const route = getCurrentRoute();
		if (isMaintenanceMode()) {
			currentRouteSignal.value = 'maintenance';
			window.history.replaceState({}, '', `/maintenance`);
		} else {
			if (route === currentRouteSignal.value) return;
			if (Object.keys(routes).includes(route) && route !== 'maintenance') {
				currentRouteSignal.value = route;
			} else if (route) {
				window.history.replaceState({}, '', `/${defaultRoute}`);
			}
		}
	});

	return currentRouteSignal;
};
