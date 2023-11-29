import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { AppContext } from '../app';
import { getEffort } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, removeCookie } from '../utils/cookie';
import { Effort as TEffort } from '../utils/types';
import { Month } from './Month';

export const Effort = component$(() => {
	const appStore = useContext(AppContext);
	const effortSig = useSignal<TEffort>([]);

	useTask$(async () => {
		if (!getCookie(COOKIE_TOKEN_KEY)) {
			appStore.route = 'AUTH';
		}

		const effort = await getEffort();
		if (!effort) {
			removeCookie(COOKIE_TOKEN_KEY);
			appStore.route = 'AUTH';
		}

		effortSig.value = effort;
	});

	return (
		<div class='p-8'>
			{effortSig.value.map((item, key) => {
				const [[name, value]] = Object.entries(item);
				return (
					<div key={key} class='flex'>
						<div class='w-[300px] flex items-center'>{name}</div>
						{value.map((month, key) => (
							<Month key={key} month={month} name={name} />
						))}
					</div>
				);
			})}
		</div>
	);
});
