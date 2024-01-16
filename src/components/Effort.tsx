import {
	component$,
	useComputed$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { AppContext } from '../app';
import { purgeName } from '../utils';
import { getEffort, getSkills } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, removeCookie } from '../utils/cookie';
import { getDateLabelFromMonthYear } from '../utils/dates';
import { Effort as TEffort } from '../utils/types';
import { Charts } from './Charts';
import { Month } from './Month';

export const Effort = component$(() => {
	const appStore = useContext(AppContext);
	const effortSig = useSignal<TEffort>([]);
	const crewSig = useSignal<{ user: string; crew: string }[]>();
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
		const skillMatrix = await getSkills();
		if (!effort || !skillMatrix) {
			removeCookie(COOKIE_TOKEN_KEY);
			appStore.route = 'AUTH';
		}

		effortSig.value = effort;
		crewSig.value = skillMatrix.map((el) => {
			const [name, { crew }] = Object.entries(el)[0];
			const user = name.toLowerCase().replace(' ', '.');
			return { user, crew };
		});
	});

	return (
		<div class='p-8 w-max'>
			<div class='border-red-600 border-b-2'>
				{effortSig.value.map((item, key) => {
					const [[name, value]] = Object.entries(item);
					return (
						<div key={key} class='flex'>
							<div class='min-w-[200px] flex flex-col items-center justify-center border-t-2 border-x-2 border-red-600'>
								<span>{purgeName(name)}</span>
								<span>
									{
										crewSig.value?.find(
											({ user }) =>
												purgeName(name) === user
										)?.crew
									}
								</span>
							</div>
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
			</div>
			{monthYearListSig.value.map((monthYear, key) => {
				return (
					<div key={key} class='m-4'>
						<div class='text-lg font-bold'>
							{getDateLabelFromMonthYear(monthYear)}
						</div>
						<Charts monthYear={monthYear} effort={effortSig} />
					</div>
				);
			})}
		</div>
	);
});
