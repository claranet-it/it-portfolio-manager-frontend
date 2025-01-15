export type Company = {
	id: string;
	domain: string;
	name: string;
	image_url: string;
	skills: CompanySkill[];
};

export type CompanySkill = {
	id: number;
	name: string;
	description: string;
	serviceLine: string;
	visible: boolean;
};
