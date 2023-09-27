import { component$ } from '@builder.io/qwik';
import { Link } from 'qwik-router';

export const Home = component$(() => {
	return (
		<>
			Home
			<Link href='/login'>Login</Link>
		</>
	);
});
