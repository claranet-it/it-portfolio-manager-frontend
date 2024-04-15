import { Slot, component$ } from '@builder.io/qwik';
import { Route } from '../router';
import { Header } from './Header';

export const Layout = component$<{ currentRoute: Exclude<Route, 'auth'> }>(({ currentRoute }) => {
	return (
		<div class='h-screen flex flex-col'>
			<Header currentRoute={currentRoute} />

			<div class='w-full grow flex'>
				<Slot />
			</div>
		</div>
	);
});
