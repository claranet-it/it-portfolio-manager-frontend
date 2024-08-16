import { ProjectType } from '@models/project';
import { ColumnChartSeries, DonutChartSeries, ReportTimeEntry } from '@models/report';
import { formatDateString, getDaysInRange } from './dates';
import { getProjectCateogriesProp } from './timesheet';

export const columnChartSeriesAdapter = (
	data: ReportTimeEntry[],
	from: Date,
	to: Date
): ColumnChartSeries[] => {
	const dateRange = getDaysInRange(from, to).map((date) => formatDateString(date.date));

	const projectTypeList = data.reduce((prev: ProjectType[], entry: ReportTimeEntry) => {
		if (!prev.includes(entry.project.type)) prev.push(entry.project.type);
		return prev;
	}, []);

	const series: ColumnChartSeries[] = projectTypeList.map((projectType: ProjectType) => {
		// For each day, find the time entry by type and date, then sum the hours
		const _data = dateRange.map((date) => {
			const totalHours = data
				.filter((entry) => entry.project.type === projectType && entry.date === date)
				.reduce((prev: number, entry: ReportTimeEntry) => {
					return prev + entry.hours;
				}, 0);

			return { x: date, y: totalHours };
		});

		return {
			type: projectType,
			label: getProjectCateogriesProp(projectType).label,
			data: _data,
		};
	});

	return series;
};

export const donutChartGroupByProjectsAdapter = (data: ReportTimeEntry[]): DonutChartSeries => {
	const projectList = data.reduce(
		(
			prev: Record<string, { totalHours: number; type: ProjectType }>,
			entry: ReportTimeEntry
		) => {
			if (prev[entry.project.name]) {
				prev[entry.project.name].totalHours =
					prev[entry.project.name].totalHours + entry.hours;
				prev[entry.project.name].type = entry.project.type;
			} else {
				prev[entry.project.name] = { totalHours: entry.hours, type: entry.project.type };
			}
			return prev;
		},
		{}
	);

	const projectListhours = Object.values(projectList).map((project) => project.totalHours);
	const projectListType = Object.values(projectList).map((project) => project.type);
	const projectListLabels = Object.keys(projectList);

	return {
		series: projectListhours,
		types: projectListType,
		labels: projectListLabels,
	};
};
