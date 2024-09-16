import { ProjectType } from './project';
import { TimeEntry } from './timeEntry';
import { User } from './user';

export type ReportProductivityItem = {
	user: User;
	workedHours: number;
	totalTracked: TotalTracked;
	totalProductivity: number;
};

export type TotalTracked = {
	billable: number;
	'non-billable': number;
	'slack-time': number;
	absence: number;
};

export type BarLegendColor = {
	fontColor: string;
	bgColor: string;
};

export type ColumnChartSeries = {
	type: ProjectType;
	label: string;
	data: {
		x: string; // date string YYYY-MM-DD
		y: number; // hours
	}[];
};

export type DonutChartSeries = {
	series: number[];
	types: ProjectType[];
	labels: string[];
	colors?: string[];
};

export type ReportTimeEntry = Omit<TimeEntry, 'isUnsaved' | 'index'> & {
	email: string;
	crew: string;
};

export type ReportTab = 'project' | 'productivity';

export type ReportRow = {
	type: ProjectType;
	label: string;
	hours: number;
	color?: string;
	percentage: number;
};

export type GroupByKeys = keyof ReportTimeEntry;

export type ReportGroupedData = {
	[key: string]: any;
	duration: number;
	subGroups?: ReportGroupedData[];
};
