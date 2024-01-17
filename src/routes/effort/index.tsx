import {
	component$,
	useComputed$,
	useContext,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { Filters } from '~/components/Filters';
import { Month } from '~/components/Month';
import { MonthChart } from '~/components/MonthChart';
import { TotalChart } from '~/components/TotalChart';
import { t } from '~/locale/labels';
import { purgeName } from '~/utils';
import { getEffort, getSkills } from '~/utils/api';
import { COOKIE_TOKEN_KEY } from '~/utils/constants';
import { getCookie, removeCookie } from '~/utils/cookie';
import { getDateLabelFromMonthYear } from '~/utils/dates';
import type { Effort as TEffort } from '../../utils/types';
import { AppContext } from '../layout';

export default component$(() => {
	const navigate = useNavigate();
	const appStore = useContext(AppContext);
	const effortSig = useSignal<TEffort>([]);
	const usersCrewSig = useSignal<{ user: string; crew: string }[]>();
	const monthYearListSig = useComputed$<string[]>(() => {
		if (effortSig.value.length > 0) {
			const [[, value]] = Object.entries(effortSig.value[0]);
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

	useVisibleTask$(async () => {
		if (!getCookie(COOKIE_TOKEN_KEY)) {
			navigate('/');
		}

		const effort = await getEffort();
		const skillMatrix = await getSkills();
		if (!effort || !skillMatrix) {
			removeCookie(COOKIE_TOKEN_KEY);
			navigate('/');
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
												effortSig.value =
													await getEffort();
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
