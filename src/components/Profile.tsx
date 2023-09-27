import { component$, useTask$ } from '@builder.io/qwik';
import { auth0 } from '../app';

export const Profile = component$(() => {
	useTask$(async () => {
		try {
			const token = await auth0.getTokenSilently();
			console.log(token);
		} catch (error: unknown) {
			throw error;
		}
	});
	return <>Profile</>;
});
