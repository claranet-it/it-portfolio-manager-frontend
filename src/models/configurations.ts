import { ToastEvent } from './event';
import { SkillData } from './skill';

export type AppStore = {
	configuration: Configuration;
	events: ToastEvent[];
	isLoading: boolean;
};

export type Configuration = {
	company: string;
	crews: { name: string; service_line: string }[];
	skills: Record<string, SkillData[]>;
	scoreRange: {
		min: number;
		max: number;
	};
	scoreRangeLabels: Record<number, string>;
};
