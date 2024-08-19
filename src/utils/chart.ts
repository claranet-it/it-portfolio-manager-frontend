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

const generateHexColor = (input: string): string | null => {
	const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
	const isUUID = /^[0-9a-fA-F]{16}$/.test(input);

	if (!isEmail && !isUUID) {
		return null; // Return null if input is neither a valid email nor a UUID
	}

	// Extract usable characters from the input
	let usableInput: string;

	if (isEmail) {
		usableInput = input.replace(/[^0-9a-fA-F]/g, ''); // Remove non-hex characters from the email
	} else if (isUUID) {
		usableInput = input; // Use the UUID directly since it's already hex characters
	} else {
		return null; // Just a safeguard, although this case should be covered by earlier checks
	}

	usableInput = usableInput.slice(0, 6); // Trim to the first 6 characters

	// If the result is less than 6 characters, pad with '0'
	let hexColor = usableInput.padEnd(6, '0');

	return `#${hexColor}`;
};
