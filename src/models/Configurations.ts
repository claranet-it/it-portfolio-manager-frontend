export type AppStore = {
	configuration: Configuration;
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
