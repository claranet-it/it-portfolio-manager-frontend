import { Slot, component$ } from '@builder.io/qwik';
import { Header } from './Header';

export const Layout = component$(() => {
	return (
		<>
			<Header />
			<Slot />
		</>
	);
});
