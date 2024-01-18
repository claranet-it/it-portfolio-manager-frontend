import { Slot, component$ } from '@builder.io/qwik';
import { Route } from '../utils/router';
import { Header } from './Header';

export const Layout = component$<{ currentRoute: Route }>(
	({ currentRoute }) => {
		return (
			<>
				<Header currentRoute={currentRoute} />
				<Slot />
			</>
		);
	}
);
