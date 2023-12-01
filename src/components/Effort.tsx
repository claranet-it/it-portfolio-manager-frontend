import {
	component$,
	useComputed$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { AppContext } from '../app';
import { purgeName } from '../utils';
import { getEffort } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, removeCookie } from '../utils/cookie';
import { Effort as TEffort } from '../utils/types';
import { Charts } from './Charts';
import { Month } from './Month';

export const Effort = component$(() => {
	const appStore = useContext(AppContext);
	const effortSig = useSignal<TEffort>([]);
	const monthYearListSig = useComputed$<string[]>(() => {
		if (effortSig.value.length > 0) {
			const [[_, value]] = Object.entries(effortSig.value[0]);
			return value.map((m) => m.month_year);
		}
		return [];
	});

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
						<div class='w-[300px] flex items-center'>{purgeName(name)}</div>
						{value.map((month, key) => (
							<Month
								key={key}
								month={month}
								name={name}
								onChange$={async () => {
									effortSig.value = await getEffort();
								}}
							/>
						))}
					</div>
				);
			})}
			{monthYearListSig.value.map((monthYear, key) => {
				return (
					<div key={key} class='m-4'>
						<div class='text-lg font-bold'>{monthYear}</div>
						<Charts monthYear={monthYear} effort={effortSig} />
					</div>
				);
			})}
		</div>
	);
});
