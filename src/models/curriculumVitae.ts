export type CurriculumVitaeData = {
	name: string;
	email: string;
	role?: string;
	intro?: string;
	main_skills?: string[];
	education?: ExperienceData[];
	work?: ExperienceData[];
};

export type ExperienceData = {
	description?: string;
	year_start?: number;
	year_end?: number;
	institution?: string;
};
