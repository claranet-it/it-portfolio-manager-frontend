import { ProjectType } from '@models/project';
import { ColumnChartSeries, DonutChartSeries, ReportRow, ReportTimeEntry } from '@models/report';
import { TimeEntry } from '@models/timeEntry';
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

export const donutChartGroupByUsesAdapter = (data: ReportTimeEntry[]): DonutChartSeries => {
	const userList = data.reduce(
		(
			prev: Record<string, { totalHours: number; type: ProjectType; color?: string }>,
			entry: ReportTimeEntry
		) => {
			if (prev[entry.email]) {
				prev[entry.email].totalHours = prev[entry.email].totalHours + entry.hours;
				prev[entry.email].type = entry.project.type;
				prev[entry.email].color = generateHexColor(entry.email) ?? '#000';
			} else {
				prev[entry.email] = {
					totalHours: entry.hours,
					type: entry.project.type,
					color: generateHexColor(entry.email) ?? '#000',
				};
			}
			return prev;
		},
		{}
	);

	const projectListhours = Object.values(userList).map((user) => user.totalHours);
	const projectListType = Object.values(userList).map((user) => user.type);
	const projectListColors = Object.values(userList).map((user) => user.color!);
	const projectListLabels = Object.keys(userList);

	return {
		series: projectListhours,
		types: projectListType,
		labels: projectListLabels,
		colors: projectListColors,
	};
};

export const donutChartGroupByTaskAdapter = (data: ReportTimeEntry[]): DonutChartSeries => {
	const taskList = data.reduce(
		(
			prev: Record<string, { totalHours: number; type: ProjectType; color?: string }>,
			entry: ReportTimeEntry
		) => {
			if (prev[entry.task]) {
				prev[entry.task].totalHours = prev[entry.task].totalHours + entry.hours;
				prev[entry.task].type = entry.project.type;
				prev[entry.task].color = generateHexColor(entry.task) ?? '#000';
			} else {
				prev[entry.task] = {
					totalHours: entry.hours,
					type: entry.project.type,
					color: generateHexColor(entry.task) ?? '#000',
				};
			}
			return prev;
		},
		{}
	);

	const taskListhours = Object.values(taskList).map((task) => task.totalHours);
	const taskListType = Object.values(taskList).map((task) => task.type);
	const taskListColors = Object.values(taskList).map((task) => task.color!);
	const taskListLabels = Object.keys(taskList);

	return {
		series: taskListhours,
		types: taskListType,
		labels: taskListLabels,
		colors: taskListColors,
	};
};

export const listGroupByProjectsAdapter = (data: ReportTimeEntry[]): ReportRow[] => {
	const totalHours = data.reduce((prev: number, entry: TimeEntry) => {
		prev = prev + entry.hours;
		return prev;
	}, 0);

	const projectList = data.reduce((prev: Record<string, ReportRow>, entry: ReportTimeEntry) => {
		if (prev[entry.project.name]) {
			const hours = prev[entry.project.name].hours + entry.hours;
			prev[entry.project.name].hours = hours;
			prev[entry.project.name].type = entry.project.type;
			prev[entry.project.name].label = entry.project.name;
			prev[entry.project.name].percentage = Number(((hours / totalHours) * 100).toFixed(2));
		} else {
			prev[entry.project.name] = {
				hours: entry.hours,
				type: entry.project.type,
				label: entry.project.name,
				percentage: Number(((entry.hours / totalHours) * 100).toFixed(2)),
			};
		}
		return prev;
	}, {});
	return Object.values(projectList);
};

export const listGroupByUsersAdapter = (data: ReportTimeEntry[]): ReportRow[] => {
	const totalHours = data.reduce((prev: number, entry: TimeEntry) => {
		prev = prev + entry.hours;
		return prev;
	}, 0);

	const usersList = data.reduce((prev: Record<string, ReportRow>, entry: ReportTimeEntry) => {
		if (prev[entry.email]) {
			const hours = prev[entry.email].hours + entry.hours;
			prev[entry.email].hours = hours;
			prev[entry.email].type = entry.project.type;
			prev[entry.email].label = entry.email;
			prev[entry.email].color = generateHexColor(entry.email) ?? '#000';
			prev[entry.email].percentage = Number(((hours / totalHours) * 100).toFixed(2));
		} else {
			prev[entry.email] = {
				hours: entry.hours,
				type: entry.project.type,
				label: entry.email,
				color: generateHexColor(entry.email) ?? '#000',
				percentage: Number(((entry.hours / totalHours) * 100).toFixed(2)),
			};
		}
		return prev;
	}, {});

	return Object.values(usersList);
};

export const listGroupByTaskAdapter = (data: ReportTimeEntry[]): ReportRow[] => {
	const totalHours = data.reduce((prev: number, entry: TimeEntry) => {
		prev = prev + entry.hours;
		return prev;
	}, 0);

	const taskList = data.reduce((prev: Record<string, ReportRow>, entry: ReportTimeEntry) => {
		if (prev[entry.task]) {
			const hours = prev[entry.task].hours + entry.hours;
			prev[entry.task].hours = hours;
			prev[entry.task].type = entry.project.type;
			prev[entry.task].label = entry.task;
			prev[entry.task].color = generateHexColor(entry.task) ?? '#000';
			prev[entry.task].percentage = Number(((hours / totalHours) * 100).toFixed(2));
		} else {
			prev[entry.task] = {
				hours: entry.hours,
				type: entry.project.type,
				label: entry.task,
				color: generateHexColor(entry.task) ?? '#000',
				percentage: Number(((entry.hours / totalHours) * 100).toFixed(2)),
			};
		}
		return prev;
	}, {});

	return Object.values(taskList);
};

export const getReportTotalHours = (data: ReportTimeEntry[]): number => {
	return data.reduce((prev: number, time: ReportTimeEntry) => {
		prev = prev + time.hours;
		return prev;
	}, 0);
};

export const getReportBillableHours = (data: ReportTimeEntry[]): number => {
	return data.reduce((prev: number, time: ReportTimeEntry) => {
		if (time.project.type === 'billable') {
			prev = prev + time.hours;
		}
		return prev;
	}, 0);
};

export const getTopProject = (data: ReportTimeEntry[]): string => {
	const projectList = data.reduce((prev: Record<string, number>, time: ReportTimeEntry) => {
		if (prev[time.project.name]) {
			prev[time.project.name] = prev[time.project.name] + time.hours;
		} else {
			prev[time.project.name] = time.hours;
		}
		return prev;
	}, {});

	return Object.keys(projectList).reduce((maxKey, key) => {
		return projectList[key] > (projectList[maxKey] ?? -Infinity) ? key : maxKey;
	}, '');
};

export const getTopCustomer = (data: ReportTimeEntry[]): string => {
	const projectList = data.reduce((prev: Record<string, number>, time: ReportTimeEntry) => {
		if (prev[time.customer]) {
			prev[time.customer] = prev[time.customer] + time.hours;
		} else {
			prev[time.customer] = time.hours;
		}
		return prev;
	}, {});

	return Object.keys(projectList).reduce((maxKey, key) => {
		return projectList[key] > (projectList[maxKey] ?? -Infinity) ? key : maxKey;
	}, '');
};

type GroupByListRow = {
	title: string;
	duration: number;
};

export type GroupByKeys = keyof ReportTimeEntry;

export const groupBy = (data: ReportTimeEntry[], groupKey: GroupByKeys): GroupByListRow[] => {
	const groupedResult = data.reduce(
		(prev: Record<string, GroupByListRow>, time: ReportTimeEntry) => {
			let key;
			if (typeof time[groupKey] === 'object') {
				key = time[groupKey]['name'] as string;
			} else {
				key = time[groupKey] as string;
			}

			if (prev[key]) {
				prev[key].duration = prev[key].duration + time.hours;
			} else {
				prev[key] = {
					title: key,
					duration: time.hours,
				};
			}
			return prev;
		},
		{}
	);

	return Object.values(groupedResult);
};

const generateHexColor = (input: string): string | null => {
	// Extract usable characters from the input: only hex characters (0-9, a-f, A-F)
	let usableInput = input.replace(/[^0-9a-fA-F]/g, '');

	// Trim to the first 6 characters, if necessary
	usableInput = usableInput.slice(0, 6);

	// If the result is less than 6 characters, pad with '0'
	let hexColor = usableInput.padEnd(6, '0');

	return `#${hexColor}`;
};
