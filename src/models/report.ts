import { User } from './user';

export type ReportProductivityItem = {
	user: User;
	workedHours: number;
	totalTracked: TotalTracked;
	totalProductivity: number;
};

export type TotalTracked = {
	billableProductivity: number;
	nonBillableProductivity: number;
	slackTime: number;
	absence: number;
};

export type BarLegendColor = {
	fontColor: string;
	bgColor: string;
};
