import { component$, Signal, useComputed$ } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';
import { t } from 'src/locale/labels';
import {
	columnChartSeriesAdapter,
	donutChartGroupByProjectsAdapter,
	donutChartGroupByTaskAdapter,
	donutChartGroupByUsesAdapter,
	listGroupByProjectsAdapter,
	listGroupByTaskAdapter,
	listGroupByUsersAdapter,
} from 'src/utils/chart';
import { REPORT_LIST_RESULTS_PER_PAGE } from 'src/utils/constants';
import { ColumnChart } from '../charts/ColumnChart';
import { DonutChart } from '../charts/DonutChart';
import { ReportList } from './ReportList';

interface ProjectReportDetailsProps {
	data: ReportTimeEntry[];
	from: Signal<Date>;
	to: Signal<Date>;
	ref: Signal<HTMLElement | undefined>;
}

export const ProjectReportDetails = component$<ProjectReportDetailsProps>(
	({ data, from, to, ref }) => {
		const daysSeries = useComputed$(() => {
			return columnChartSeriesAdapter(data, from.value, to.value);
		});
		// ____ PROJECTS _____ //
		const groupByProjectSeries = useComputed$(() => {
			return donutChartGroupByProjectsAdapter(data);
		});

		const listGroupByProjectSeries = useComputed$(() => {
			return listGroupByProjectsAdapter(data);
		});

		// ____ USERS _____ //

		const groupByUserSeries = useComputed$(() => {
			return donutChartGroupByUsesAdapter(data);
		});

		const listGroupByUserSeries = useComputed$(() => {
			return listGroupByUsersAdapter(data);
		});

		// ____ TASK _____ //

		const groupByTaskSeries = useComputed$(() => {
			return donutChartGroupByTaskAdapter(data);
		});

		const listGroupByTaskSeries = useComputed$(() => {
			return listGroupByTaskAdapter(data);
		});

		return (
			<div class='flex flex-col p-3 divide-y divide-surface-70' ref={ref}>
				<ColumnChart data={daysSeries} />

				{/* ____ PROJECTS _____  */}

				{groupByProjectSeries.value.series.length > 0 &&
					listGroupByProjectSeries.value.length > 0 && (
						<div class='flex sm:flex-col md:flex-row lg:flex-row py-6 md:justify-between lg:justify-between gap-1'>
							<div class='flex-none'>
								<h3 class='text-xl font-bold text-dark-grey'>
									{t('PROJECT_LABEL')}
								</h3>
							</div>

							<div class='flex-1 items-center text-center'>
								<div class='max-w-lg'>
									<DonutChart data={groupByProjectSeries} />
								</div>
							</div>

							<div class='sm:w-full flex-1 '>
								<ReportList
									data={listGroupByProjectSeries}
									resultsPerPage={REPORT_LIST_RESULTS_PER_PAGE}
								/>
							</div>
						</div>
					)}

				{/* ____ USERS _____  */}

				{groupByUserSeries.value.series.length > 0 &&
					listGroupByUserSeries.value.length > 0 && (
						<div class='flex sm:flex-col md:flex-row lg:flex-row py-6 md:justify-between lg:justify-between gap-1'>
							<div class='flex-none'>
								<h3 class='text-xl font-bold text-dark-grey'>{t('USER_LABEL')}</h3>
							</div>

							<div class='flex-1 items-center text-center'>
								<div class='max-w-lg'>
									<DonutChart data={groupByUserSeries} />
								</div>
							</div>

							<div class='sm:w-full flex-1 '>
								<ReportList
									data={listGroupByUserSeries}
									resultsPerPage={REPORT_LIST_RESULTS_PER_PAGE}
								/>
							</div>
						</div>
					)}

				{/* ____ TASK _____  */}

				{groupByTaskSeries.value.series.length > 0 &&
					listGroupByTaskSeries.value.length > 0 && (
						<div class='flex sm:flex-col md:flex-row lg:flex-row py-6 md:justify-between lg:justify-between gap-1'>
							<div class='flex-none'>
								<h3 class='text-xl font-bold text-dark-grey'>{t('TASK_LABEL')}</h3>
							</div>

							<div class='flex-1 items-center text-center'>
								<div class='max-w-lg'>
									<DonutChart data={groupByTaskSeries} />
								</div>
							</div>

							<div class='sm:w-full flex-1 '>
								<ReportList
									data={listGroupByTaskSeries}
									resultsPerPage={REPORT_LIST_RESULTS_PER_PAGE}
								/>
							</div>
						</div>
					)}
			</div>
		);
	}
);
