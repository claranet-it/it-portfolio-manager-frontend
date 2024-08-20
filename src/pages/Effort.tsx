import { component$, useComputed$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { EffortMatrix } from '@models/effort';
import { Month } from '@models/month';
import { AppContext } from 'src/app';
import { EffortTable } from 'src/components/EffortTable';
import { Filters } from 'src/components/Filters';
import { MonthChart } from 'src/components/MonthChart';
import { useEffort } from 'src/hooks/useEffort';
import { getDateLabelFromMonthYear } from 'src/utils/dates';
import { TotalChart } from '../components/TotalChart';
import { t } from '../locale/labels';

export const Effort = component$(() => {
	const appStore = useContext(AppContext);
	const { monthYearListSig, loadEffort, effortSig, updateEffortField } = useEffort();

	const selectedCrewSig = useSignal('');
	//const selectedSkillSig = useSignal('');
	const selectedNameSig = useSignal('');
	const selectedServiceLineSig = useSignal('');
	const onlyCompanySig = useSignal(false);

	const filteredEffortSig = useComputed$<EffortMatrix>(() => {
		let result = effortSig.value;
		//Filter by Name
		if (selectedNameSig.value) {
			result = result.filter((el) => {
				const [{ name }] = Object.values(el);
				return name.toLowerCase().includes(selectedNameSig.value.toLowerCase());
			});
		}

		//Filter by skill
		// if (selectedSkillSig.value) {
		// 	result = result.filter((el) => {
		// 		const [{ skill }] = Object.values(el);
		// 		return crew.toLowerCase().includes(selectedSkillSig.value.toLowerCase());
		// 	});
		// }

		//Filter by Crew
		if (selectedCrewSig.value) {
			result = result.filter((el) => {
				const [{ crew }] = Object.values(el);
				return crew?.toLowerCase().includes(selectedCrewSig.value.toLowerCase());
			});
		}

		//Filter by service line
		if (selectedServiceLineSig.value) {
			const selectedCrews = appStore.configuration.crews.filter(
				({ service_line }) => service_line === selectedServiceLineSig.value
			);
			result = result.filter((el) => {
				const [{ crew }] = Object.values(el);
				return selectedCrews.some(({ name }) =>
					crew?.toLowerCase().includes(name.toLowerCase())
				);
			});
		}
		// Filter only company
		if (onlyCompanySig.value) {
			result = result.filter((el) => {
				const [{ isCompany }] = Object.values(el);
				return isCompany;
			});
		}

		return result;
	});

	useTask$(async () => {
		loadEffort();
	});

	const averageEffortByMonthSig = useComputed$<
		Record<string, Omit<Month, 'people' | 'notes' | 'month_year'>>
	>(() => {
		const result = filteredEffortSig.value.reduce(
			(acc, el) => {
				const [{ effort }] = Object.values(el);
				if (effort)
					for (const { month_year, confirmedEffort, tentativeEffort } of effort) {
						acc[month_year] = {
							confirmedEffort:
								(acc[month_year]?.confirmedEffort || 0) + confirmedEffort,
							tentativeEffort:
								(acc[month_year]?.tentativeEffort || 0) + tentativeEffort,
							totalEffort: 0,
						};
					}
				return acc;
			},
			{} as Record<string, Omit<Month, 'people' | 'notes' | 'month_year'>>
		);

		for (const key in result) {
			result[key].confirmedEffort = Math.round(
				result[key].confirmedEffort / filteredEffortSig.value.length
			);
			result[key].tentativeEffort = Math.round(
				result[key].tentativeEffort / filteredEffortSig.value.length
			);
			result[key].totalEffort = result[key].confirmedEffort + result[key].tentativeEffort;
		}

		return result;
	});

	return (
		<div class='px-6 pt-5 w-full space-y-5'>
			<h1 class='text-2xl font-bold text-darkgray-900 me-4'>{t('EFFORT_PAGE_TITLE')}</h1>

			<Filters
				selectedCrew={selectedCrewSig}
				selectedName={selectedNameSig}
				selectedServiceLine={selectedServiceLineSig}
				onlyCompany={onlyCompanySig}
			/>

			{!!filteredEffortSig.value.length && (
				<EffortTable
					averageEffortByMonth={averageEffortByMonthSig}
					filteredEffort={filteredEffortSig}
					updateEffortField={updateEffortField}
				/>
			)}

			{!!filteredEffortSig.value.length && (
				<>
					{/* Total chart */}
					<div class='m-4'>
						<div class='text-lg font-bold'>{t('total')}</div>
						<TotalChart
							monthYearList={monthYearListSig}
							effortSig={filteredEffortSig}
						/>
					</div>

					{/* Annual Charts area */}
					<div class='grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2'>
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
					</div>
				</>
			)}
		</div>
	);
});
