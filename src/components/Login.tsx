import { component$ } from '@builder.io/qwik';
import { auth0 } from '../app';

export const Login = component$(() => {
	return (
		<>
			<button
				onClick$={async () => {
					await auth0.loginWithRedirect();
				}}
			>
				Login
			</button>
		</>
	);
});
