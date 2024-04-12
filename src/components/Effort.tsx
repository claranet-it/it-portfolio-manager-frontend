import { component$, useComputed$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { AppContext } from '../app';
import { getConfiguration, getEffort } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, removeCookie } from '../utils/cookie';
import { navigateTo } from '../utils/router';
import { EffortMatrix } from '../utils/types';
import { EffortTable } from './EffortTable';
import { Filters } from './Filters';
import { Toast } from './Toast';

export const Effort = component$(() => {
	const appStore = useContext(AppContext);
	const effortSig = useSignal<EffortMatrix>([]);

	const monthYearListSig = useComputed$<string[]>(() => {
		if (effortSig.value.length > 0) {
			const [{ effort }] = Object.values(effortSig.value[0]);
			return effort.map(({ month_year }) => month_year);
		}
		return [];
	});

	const selectedCrewSig = useSignal('');
	const selectedSkillSig = useSignal('');
	const selectedNameSig = useSignal('');
	const selectedServiceLineSig = useSignal('');
	const errorMessageSig = useSignal('');

	const filteredEffortSig = useComputed$<EffortMatrix>(() => {
		let result = effortSig.value;

		// Filter by Name
		if (selectedNameSig.value) {
			result = result.filter((el) => {
				const [{ name }] = Object.values(el);
				return name.toLowerCase().includes(selectedNameSig.value.toLowerCase());
			});
		}

		// Filter by skill
		// if (selectedSkillSig.value) {
		// 	result = result.filter((el) => {
		// 		const [{ skill }] = Object.values(el);
		// 		return crew.toLowerCase().includes(selectedSkillSig.value.toLowerCase());
		// 	});
		// }

		// Filter by Crew
		if (selectedCrewSig.value) {
			result = result.filter((el) => {
				const [{ crew }] = Object.values(el);
				return crew.toLowerCase().includes(selectedCrewSig.value.toLowerCase());
			});
		}

		// Filter by service line
		if (selectedServiceLineSig.value) {
			const selectedCrews = appStore.configuration.crews.filter(
				({ service_line }) => service_line === selectedServiceLineSig.value
			);
			result = result.filter((el) => {
				const [{ crew }] = Object.values(el);
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
		if (!effort) {
			removeCookie(COOKIE_TOKEN_KEY);
			navigateTo('auth');
		}

		effortSig.value = effort;
	});

	const averageEffortByMonthSig = useComputed$<
		Record<string, { confirmed: number; tentative: number; total: number }>
	>(() => {
		const result = filteredEffortSig.value.reduce(
			(acc, el) => {
				const [{ effort }] = Object.values(el);
				for (const { month_year, confirmedEffort, tentativeEffort } of effort) {
					acc[month_year] = {
						confirmed: (acc[month_year]?.confirmed || 0) + confirmedEffort,
						tentative: (acc[month_year]?.tentative || 0) + tentativeEffort,
						total: 0,
					};
				}
				return acc;
			},
			{} as Record<string, { confirmed: number; tentative: number; total: number }>
		);

		for (const key in result) {
			result[key].confirmed = Math.round(
				result[key].confirmed / filteredEffortSig.value.length
			);
			result[key].tentative = Math.round(
				result[key].tentative / filteredEffortSig.value.length
			);
			result[key].total = result[key].confirmed + result[key].tentative;
		}

		return result;
	});

	return (
		<div class='px-6 pt-5 w-full space-y-5'>
			{errorMessageSig.value && (
				<Toast
					message={errorMessageSig.value}
					onClose$={() => (errorMessageSig.value = '')}
				/>
			)}

			<Filters
				selectedCrew={selectedCrewSig}
				selectedName={selectedNameSig}
				selectedSkill={selectedSkillSig}
				selectedServiceLine={selectedServiceLineSig}
			/>

			{!!filteredEffortSig.value.length && (
				<EffortTable
					averageEffortByMonth={averageEffortByMonthSig}
					filteredEffort={filteredEffortSig}
					errorMessage={errorMessageSig}
				/>
			)}

			{!!filteredEffortSig.value.length && (
				<>
					{/* Total chart */}
					{/* <div class='m-4'>
						<div class='text-lg font-bold'>{t('total')}</div>
						<TotalChart
							monthYearList={monthYearListSig}
							effortSig={filteredEffortSig}
						/>
					</div> */}

					{/* Annuly Charts area */}
					{/* <div class='xl:grid xl:grid-cols-2'>
						{monthYearListSig.value.map((monthYear, key) => {
							return (
								<div key={key} class='m-4'>
									<div class='text-lg font-bold'>
										{getDateLabelFromMonthYear(monthYear)}
									</div>
									<MonthChart
										monthYear={monthYear}
										effortSig={filteredEffortSig}
									/>
								</div>
							);
						})}
					</div> */}
				</>
			)}
		</div>
	);
});
