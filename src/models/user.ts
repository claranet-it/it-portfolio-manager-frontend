export type UserMe = {
	email: string;
	name: string;
	picture: string;
	crew?: string;
	company?: string;
	place?: string;
	crewLeader: Boolean;
};

export type SetUserProfile = {
	crew: string;
	company: string;
};
