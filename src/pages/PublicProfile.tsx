import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { getRouteParams } from 'src/router';

export const PublicProfile = component$(() => {
	const email = useSignal<string | null>(null);

	useTask$(() => {
		const params = getRouteParams();
		email.value = params.email ? params.email[0] : null;
	});

	return <div class='w-full space-y-3 px-6 pb-10 pt-2.5'>{email.value}</div>;
});
