export type AppStore = {
	route: 'AUTH' | 'PROFILE' | 'SEARCH';
	configuration: Configuration;
};

export type UserMe = {
	email: string;
	name: string;
	picture: string;
	crew?: string;
	company?: string;
};

export type SetUserProfile = {
	crew: string;
	company: string;
};

export type Configuration = {
	crews: string[];
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

export type SkillFull = Skill & {
	uid: string;
	company: string;
	crew: string;
};
