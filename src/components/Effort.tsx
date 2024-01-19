import {
	component$,
	useComputed$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import { purgeName } from '../utils';
import { getConfiguration, getEffort, getSkills } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, removeCookie } from '../utils/cookie';
import { getDateLabelFromMonthYear } from '../utils/dates';
import { navigateTo } from '../utils/router';
import { Effort as TEffort } from '../utils/types';
import { Filters } from './Filters';
import { Month } from './Month';
import { MonthChart } from './MonthChart';
import { TotalChart } from './TotalChart';

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
	const selectedNameSig = useSignal('');
	const selectedServiceLineSig = useSignal('');

	const filteredEffortSig = useComputed$<TEffort>(() => {
		let result = effortSig.value;
		if (selectedNameSig.value) {
			result = result.filter((el) => {
				const [name] = Object.keys(el);
				return purgeName(name).includes(
					selectedNameSig.value.toLowerCase()
				);
			});
		}

		if (selectedCrewSig.value) {
			result = result.filter((el) => {
				const [name] = Object.keys(el);
				const crew =
					usersCrewSig.value
						?.find(({ user }) => purgeName(name) === user)
						?.crew.toLowerCase() || '';
				return crew.includes(selectedCrewSig.value.toLowerCase());
			});
		}

		if (selectedServiceLineSig.value) {
			const selectedCrews = appStore.configuration.crews.filter(
				({ service_line }) =>
					service_line === selectedServiceLineSig.value
			);
			result = result.filter((el) => {
				const [name] = Object.keys(el);
				const crew =
					usersCrewSig.value
						?.find(({ user }) => purgeName(name) === user)
						?.crew.toLowerCase() || '';
				return selectedCrews.some(({ name }) =>
					crew.toLowerCase().includes(name.toLowerCase())
				);
			});
		}
		return result;
	});

	useTask$(async () => {
		if (!getCookie(COOKIE_TOKEN_KEY)) {
			navigateTo('auth');
		}

		if (!Object.keys(appStore.configuration.skills).length) {
			const configuration = await getConfiguration();
			if (!configuration) {
				removeCookie(COOKIE_TOKEN_KEY);
				navigateTo('auth');
			}
			appStore.configuration = configuration;
		}

		const effort = await getEffort();
		const skillMatrix = await getSkills();
		if (!effort || !skillMatrix) {
			removeCookie(COOKIE_TOKEN_KEY);
			navigateTo('auth');
		}

		effortSig.value = effort;
		usersCrewSig.value = skillMatrix.map((el) => {
			const [name, { crew }] = Object.entries(el)[0];
			const user = name.toLowerCase().replace(' ', '.');
			return { user, crew };
		});
	});

	return (
		<div class='p-8 w-full'>
			<Filters
				selectedCrew={selectedCrewSig}
				selectedName={selectedNameSig}
				selectedServiceLine={selectedServiceLineSig}
			/>
			{!!filteredEffortSig.value.length && (
				<>
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
					<div class='grid grid-cols-2'>
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
					</div>
				</>
			)}
		</div>
	);
});
