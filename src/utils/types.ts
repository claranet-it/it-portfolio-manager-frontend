export type AppStore = {
	isLogged: boolean;
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
	skills: string[];
	scoreRange: {
		min: number;
		max: number;
	};
};

export type GetSkill = {
	uid: string;
	company: string;
	crew: string;
	skill: string;
	score: number;
	updatedAt: string;
};

export type PatchSkill = {
	skill: string;
	score: number;
};
