import { ProjectType } from '@models/project';
import { BarLegendColor, ReportGroupedData } from '@models/report';
import { CSV_REPORT_GROUPBY_FILE_NAME } from './constants';
import { openDownloadCSVDialog } from './csv';

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

export const downloadGroupByCSV = async (data: ReportGroupedData[], from: string, to: string) => {
	const CSV = await groupByToCSV(data, []);

	openDownloadCSVDialog(CSV, `${CSV_REPORT_GROUPBY_FILE_NAME}_${from}_${to}`);
};
