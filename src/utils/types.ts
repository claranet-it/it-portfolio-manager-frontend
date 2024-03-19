export type AppStore = {
	configuration: Configuration;
};

export type UserMe = {
	email: string;
	name: string;
	picture: string;
	crew?: string;
	company?: string;
	city?: string;
};

export type SetUserProfile = {
	crew: string;
	company: string;
};

export type Configuration = {
	crews: { name: string; service_line: string }[];
	skills: Record<string, string[]>;
	scoreRange: {
		min: number;
		max: number;
	};
	scoreRangeLabels: Record<number, string>;
};

export type Skill = {
	skill: string;
	score: number;
	skillCategory: string;
};

export type SkillMatrix = Record<
	string,
	{
		company: string;
		crew: string;
		skills: Record<string, number>;
	}
>[];

export type EffortMatrix = Record<string, Effort>[];

export type Effort = {
	company: string;
	crew: string;
	name: string;
	effort: Month[];
};

export type Month = {
	month_year: string;
	confirmedEffort: number;
	tentativeEffort: number;
	notes: string;
};

export type OpenAIResponse = { message: string };
