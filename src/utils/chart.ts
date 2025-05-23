import { ProjectType } from '@models/project';
import {
	ColumnChartSeries,
	DonutChartSeries,
	GroupByKeys,
	ReportGroupedData,
	ReportRow,
	ReportTimeEntry,
} from '@models/report';
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
			if (prev[entry.task.name]) {
				prev[entry.task.name].totalHours = prev[entry.task.name].totalHours + entry.hours;
				prev[entry.task.name].type = entry.project.type;
				prev[entry.task.name].color = generateHexColor(entry.task.name) ?? '#000';
			} else {
				prev[entry.task.name] = {
					totalHours: entry.hours,
					type: entry.project.type,
					color: generateHexColor(entry.task.name) ?? '#000',
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
			prev[entry.project.name].plannedHours = entry.project.plannedHours;
		} else {
			prev[entry.project.name] = {
				hours: entry.hours,
				type: entry.project.type,
				label: entry.project.name,
				percentage: Number(((entry.hours / totalHours) * 100).toFixed(2)),
				plannedHours: entry.project.plannedHours,
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
		if (prev[entry.task.name]) {
			const hours = prev[entry.task.name].hours + entry.hours;
			prev[entry.task.name].hours = hours;
			prev[entry.task.name].type = entry.project.type;
			prev[entry.task.name].label = entry.task.name;
			prev[entry.task.name].color = generateHexColor(entry.task.name) ?? '#000';
			prev[entry.task.name].percentage = Number(((hours / totalHours) * 100).toFixed(2));
		} else {
			prev[entry.task.name] = {
				hours: entry.hours,
				type: entry.project.type,
				label: entry.task.name,
				color: generateHexColor(entry.task.name) ?? '#000',
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

export const getReportTotalPlannedHours = (data: ReportTimeEntry[]): number => {
	const projectList: string[] = [];

	return data.reduce((prev: number, time: ReportTimeEntry) => {
		if (!projectList.includes(time.project.name)) {
			prev = prev + time.project.plannedHours;
			projectList.push(time.project.name);
		}

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
		if (prev[time.customer.id]) {
			prev[time.customer.id] = prev[time.customer.id] + time.hours;
		} else {
			prev[time.customer.id] = time.hours;
		}
		return prev;
	}, {});

	return Object.keys(projectList).reduce((maxKey, key) => {
		return projectList[key] > (projectList[maxKey] ?? -Infinity) ? key : maxKey;
	}, '');
};

const sortGroupedBySurname = (grouped: {
	[key: string]: ReportGroupedData;
}): { [key: string]: ReportGroupedData } => {
	const getSurname = (fullName: string): string => {
		const parts = fullName.split(' ');
		return parts[0];
	};

	const sortData = (data: ReportGroupedData): void => {
		if (data.subGroups && Array.isArray(data.subGroups)) {
			data.subGroups.sort((a, b) => {
				const surnameA = getSurname(Object.keys(a)[0] || '');
				const surnameB = getSurname(Object.keys(b)[0] || '');
				return surnameA.localeCompare(surnameB);
			});

			data.subGroups.forEach((subGroup) => {
				Object.values(subGroup).forEach(sortData);
			});
		}
	};

	const sortedGrouped = Object.entries(grouped)
		.sort(([keyA], [keyB]) => {
			const surnameA = getSurname(keyA);
			const surnameB = getSurname(keyB);
			return surnameA.localeCompare(surnameB);
		})
		.reduce(
			(acc, [key, value]) => {
				acc[key] = value;
				return acc;
			},
			{} as { [key: string]: ReportGroupedData }
		);

	Object.values(sortedGrouped).forEach(sortData);

	return sortedGrouped;
};

/*
Recursive function that groups data based on the current key
*/
const groupByKeys = async (
	data: ReportTimeEntry[],
	keys: GroupByKeys[],
	level: number
): Promise<ReportGroupedData[]> => {
	const key: GroupByKeys = keys[level];

	// Group the data by the current key
	const grouped: { [key: string]: ReportGroupedData } = {};

	data.forEach(async (entry) => {
		let groupKey: string;

		if (typeof entry[key] === 'object') {
			const obj = entry[key] as { name: string };
			groupKey = obj?.['name'];
		} else {
			groupKey = entry[key] as string;
		}

		if (!grouped[groupKey]) {
			// new elment
			grouped[groupKey] = { key: groupKey, duration: 0, subGroups: [], plannedHours: 0 };
		}

		grouped[groupKey].duration += entry.hours;
		grouped[groupKey].plannedHours = entry.project.plannedHours;

		if (keys[level + 1]) {
			const filteredData = data.filter((d) => {
				let dGroupKey;
				if (typeof d[key] === 'object') {
					const obj = d[key] as { name: string };
					dGroupKey = obj?.['name'];
				} else {
					dGroupKey = d[key] as string;
				}

				return dGroupKey === groupKey;
			});

			grouped[groupKey].subGroups = await groupByKeys(filteredData, keys, level + 1);
		}
	});
	if (keys.includes('name')) {
		const sortedGrouped = sortGroupedBySurname(grouped);
		return Promise.resolve(Object.values(sortedGrouped));
	}

	return Promise.resolve(Object.values(grouped));
};

export const groupData = async (
	data: ReportTimeEntry[],
	groupBy: GroupByKeys[]
): Promise<ReportGroupedData[]> => {
	return groupByKeys(data, groupBy, 0);
};

export const generateHexColor = (input: string): string | null => {
	// Extract usable characters from the input: only hex characters (0-9, a-f, A-F)
	let usableInput = input.replace(/[^0-9a-fA-F]/g, '');

	// Trim to the first 6 characters, if necessary
	usableInput = usableInput.slice(0, 6);

	// If the result is less than 6 characters, pad with '0'
	let hexColor = usableInput.padEnd(6, '0');

	return `#${hexColor}`;
};
