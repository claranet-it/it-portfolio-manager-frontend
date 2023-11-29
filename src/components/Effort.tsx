import { component$, useContext, useTask$ } from '@builder.io/qwik';
import { AppContext } from '../app';
import { getEffort } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, removeCookie } from '../utils/cookie';

export const Effort = component$(() => {
	const appStore = useContext(AppContext);

	useTask$(async () => {
		if (!getCookie(COOKIE_TOKEN_KEY)) {
			appStore.route = 'AUTH';
		}

		const effort = await getEffort();
		if (!effort) {
			removeCookie(COOKIE_TOKEN_KEY);
			appStore.route = 'AUTH';
		}

		console.log(effort, 'effort');
	});

	return <div class='p-8'>Effort</div>;
});
