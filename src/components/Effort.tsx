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
import { Month } from './Month';
import { MonthChart } from './MonthChart';
import { TotalChart } from './TotalChart';
import { t } from '../locale/labels';

export const Effort = component$(() => {
	const appStore = useContext(AppContext);
	const effortSig = useSignal<TEffort>([]);
	const usersCrewSig = useSignal<{ user: string; crew: string }[]>();
	const monthYearListSig = useComputed$<string[]>(() => {
		if (effortSig.value.length > 0) {
			const [[_, value]] = Object.entries(effortSig.value[0]);
			return value.map((m) => m.month_year);
		}
		return [];
	});
	const selectedCrewSig = useSignal('');
	const filteredEffortSig = useComputed$<TEffort>(() => {
		let result = effortSig.value;
		if (selectedCrewSig.value) {
			result = result.filter((el) => {
				const name = Object.keys(el)[0];
				const crew =
					usersCrewSig.value
						?.find(({ user }) => purgeName(name) === user)
						?.crew.toLowerCase() || '';
				return crew.includes(selectedCrewSig.value.toLowerCase());
			});
		}
		return result;
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
		usersCrewSig.value = skillMatrix.map((el) => {
			const [name, { crew }] = Object.entries(el)[0];
			const user = name.toLowerCase().replace(' ', '.');
			return { user, crew };
		});
	});

	return (
		<div class='p-8 w-max'>
			<div class='max-w-[200px] flex items-center gap-4 mb-4'>
				<span class='block text-xl font-bold'>Crew</span>
				<select
					bind:value={selectedCrewSig}
					class='border-2 border-red-500 w-full h-8'
				>
					<option value='' selected></option>
					{appStore.configuration.crews.map(({ name }) => (
						<option value={name}>{name}</option>
					))}
				</select>
			</div>
			<div class='border-red-600 border-b-2'>
				{filteredEffortSig.value.map((item, key) => {
					const [[name, value]] = Object.entries(item);
					return (
						<div key={key} class='flex'>
							<div class='min-w-[200px] flex flex-col items-center justify-center border-t-2 border-x-2 border-red-600'>
								<span>{purgeName(name)}</span>
								<span>
									{
										usersCrewSig.value?.find(
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
			<div class='m-4'>
				<div class='text-lg font-bold'>{t('total')}</div>
				<TotalChart
					monthYearList={monthYearListSig}
					effort={filteredEffortSig}
				/>
			</div>
			<section class='grid grid-cols-2'>
				{monthYearListSig.value.map((monthYear, key) => {
					return (
						<div key={key} class='m-4'>
							<div class='text-lg font-bold'>
								{getDateLabelFromMonthYear(monthYear)}
							</div>
							<MonthChart
								monthYear={monthYear}
								effort={filteredEffortSig}
							/>
						</div>
					);
				})}
			</section>
		</div>
	);
});
