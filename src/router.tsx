import { Signal, useSignal, useTask$ } from '@builder.io/qwik';
import { AuthManager } from './pages/AuthManager';
import { ChartPreview } from './pages/ChartPreview';
import { Company } from './pages/Company';
import { CurriculumVitae } from './pages/CurriculumVitae';
import { Effort } from './pages/Effort';
import { Maintenance } from './pages/Maintenance';
import { Networking } from './pages/Networking';
import { People } from './pages/People';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Profile } from './pages/Profile';
import { PublicProfile } from './pages/PublicProfile';
import { Registry } from './pages/Registry';
import { Report } from './pages/Report';
import { Search } from './pages/Search';
import { Skills } from './pages/Skills';
import { Timesheet } from './pages/Timesheet';
import { Unsubscribed } from './pages/Unsubscribed';
import { CURRICULUM_VITAE_ROUTE, PUBLIC_PROFILE_ROUTE, PUBLIC_ROUTES } from './utils/constants';
import { isMaintenanceMode } from './utils/maintenance';

export type Route = keyof typeof routes;
export type PublicRoutes = (typeof PUBLIC_ROUTES)[number];
export type PrivateRoutes = Exclude<Route, PublicRoutes>;

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
	[PUBLIC_PROFILE_ROUTE]: <PublicProfile />,
	privacy_policy: <PrivacyPolicy />,
	maintenance: <Maintenance />,
	[CURRICULUM_VITAE_ROUTE]: <CurriculumVitae />,
	unsubscribed: <Unsubscribed />,
};

export const isPublicRoute = (route: string): route is Route => {
	return PUBLIC_ROUTES.includes(route as Route);
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

export const getCurrentRoute = (): Route => {
	const match = findMatchingRoute();
	return match ? match[0] : ('' as Route);
};

export const findMatchingRoute = (): [Route, Record<string, string>] | null => {
	const segments = window.location.pathname.split('/').filter(Boolean);
	for (const [route] of Object.entries(routes)) {
		const routeSegments = route.split('/').filter(Boolean);

		if (routeSegments.length === segments.length) {
			const params: Record<string, string> = {};
			let isMatch = true;

			for (let i = 0; i < routeSegments.length; i++) {
				if (routeSegments[i].startsWith(':')) {
					params[routeSegments[i].substring(1)] = segments[i];
				} else if (routeSegments[i] !== segments[i]) {
					isMatch = false;
					break;
				}
			}

			if (isMatch) {
				return [route as Route, params];
			}
		}
	}

	return null;
};

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
