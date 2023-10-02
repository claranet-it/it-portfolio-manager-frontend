import { $, component$, useTask$ } from '@builder.io/qwik';
import { auth0 } from '../app';

export const Profile = component$(() => {
	useTask$(async () => {
		try {
			const token = await auth0.getIdTokenClaims();
			if (token) {
				console.log(token.__raw);
			}
		} catch (error: unknown) {
			throw error;
		}
	});

	const getUser = $(async () => {
		const token = 'abc';
		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/user/me/`,
			{
				method: 'GET',
				headers: new Headers({ Authorization: `Basic ${token}` }),
			}
		);
		console.log(response, 'response');
	});

	return (
		<>
			Profile
			<button onClick$={getUser}>Get User</button>
		</>
	);
});
