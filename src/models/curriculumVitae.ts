export type CurriculumVitaeData = {
	name: string;
	email: string;
	role: string;
	summary?: string;
	main_skills?: string;
	education?: Education[];
	work?: Work[];
};

export type Education = {
	note?: string;
	year_start: number;
	year_end?: number;
	institution: string;
	current?: boolean;
	id: string;
};

export type Work = Education & {
	role?: string;
};
