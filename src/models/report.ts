import { User } from './user';

export type ReportProductivityItem = {
	user: User;
	workedHours: number;
	totalTracked: TotalTracked;
	totalProductivity: number;
};

type TotalTracked = {
	billableProductivity: number;
	nonBillableProductivity: number;
	slackTime: number;
	absence: number;
};
