export type UserMe = {
	email: string;
	name: string;
	picture: string;
	crew?: string;
	company?: string;
	place?: string;
	crewLeader: boolean;
};

export type UserProfile = {
	email: string;
	id: string;
	name: string;
	role?: string;
	crew: string;
	disabled?: boolean;
	disabledAt?: string;
};

export type User = Omit<UserMe, 'crew' | 'company' | 'place' | 'crewLeader'>;

export type SetUserProfile = {
	crew: string;
	company: string;
};
