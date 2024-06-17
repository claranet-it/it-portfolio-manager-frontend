import { ToastEvent } from './event';

export type AppStore = {
	configuration: Configuration;
	events: ToastEvent[];
};

export type Configuration = {
	company: string;
	crews: { name: string; service_line: string }[];
	skills: Record<string, string[]>;
	scoreRange: {
		min: number;
		max: number;
	};
	scoreRangeLabels: Record<number, string>;
};
