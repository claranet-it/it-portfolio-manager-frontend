export type AppStore = {
	isLogged: boolean;
	configuration?: Configuration;
};

export type UserMe = {
	email: string;
	name: string;
	picture: string;
	crew: string;
};

export type Configuration = {
	crews: string[];
	skills: string[];
	scoreRange: {
		min: number;
		max: number;
	};
};
