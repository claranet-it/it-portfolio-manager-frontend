import { ProjectType } from '@models/project';
import { BarLegendColor, ReportGroupedData, ReportTimeEntry } from '@models/report';

export const getLegendBarColor = (type: string | ProjectType): BarLegendColor => {
	switch (type) {
		case 'absence': {
			return {
				bgColor: 'bg-pink-1',
				fontColor: 'text-white-100',
			};
		}
		case 'slack-time': {
			return {
				bgColor: 'bg-yellow-100',
				fontColor: 'text-dark-grey',
			};
		}
		case 'billable': {
			return {
				bgColor: 'bg-green-500',
				fontColor: 'text-white-100',
			};
		}
		case 'non-billable': {
			return {
				bgColor: 'bg-green-200',
				fontColor: 'text-dark-grey',
			};
		}
		default: {
			return {
				bgColor: 'bg-green-500',
				fontColor: 'text-dark-grey',
			};
		}
	}
};

export const getHexFromType = (type: ProjectType) => {
	//TODO: get hex value from tailwind.config.js
	switch (type) {
		case 'absence': {
			return '#B52EBF';
		}
		case 'slack-time': {
			return '#FAE022';
		}
		case 'billable': {
			return '#3F8D81';
		}
		case 'non-billable': {
			return '#B1DED3';
		}
		default: {
			return '#3F8D81';
		}
	}
};

const groupByToCSV = async (data: ReportGroupedData[], fathers: string[]) => {
	let csv: string = '';

	for (const child of Object.values(data)) {
		let row: string = '';

		if (fathers.length > 0) row += fathers.join(',') + ',';

		row += `${child['key']},${child.duration}\n`;

		if (child.subGroups !== undefined && child.subGroups.length > 0) {
			row += await groupByToCSV(child.subGroups, [...fathers, child['key']]);
		}

		csv += row;
	}

	return csv;
};

export const getReportGroupByCSV = async (data: ReportGroupedData[]): Promise<string> => {
	const CSV = await groupByToCSV(data, []);
	return CSV;
};

export const getReportCSV = async (data: ReportTimeEntry[]): Promise<string> => {
	const CSV = data.reduce((csv: String, entry: ReportTimeEntry) => {
		const row =
			[
				entry.date,
				entry.email,
				entry.name,
				entry.company,
				entry.crew,
				entry.customer,
				entry.task.name,
				entry.project.name,
				entry.project.type,
				entry.project.plannedHours,
				entry.hours,
				'"' + entry.description + '"',
				entry.startHour,
				entry.endHour,
			].join(',') + '\n';

		return (csv += row);
	}, 'DATE,EMAIL,NAME,COMPANY,CREW,CUSTOMER,PROJECT,TASK,PROJECT TYPE,PLANNED HOURS,HOURS,DESCRIPTION,START HOUR,END HOUR\n');

	return CSV;
};
