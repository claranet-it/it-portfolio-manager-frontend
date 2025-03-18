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

export type UpdateCurriculumData = {
	role?: string;
	summary?: string;
	main_skills?: string;
};

export type EducationData = {
	note?: string;
	year_start: number;
	year_end?: number;
	institution: string;
	current?: boolean;
};

export type WorkData = {
	note?: string;
	year_start: number;
	year_end?: number;
	institution: string;
	current?: boolean;
	role?: string;
};

export type EducationUpdateData = {
	note?: string;
	year_start?: number;
	year_end?: number;
	institution?: string;
	current?: boolean;
};

export type WorkUpdateData = {
	note?: string;
	year_start?: number;
	year_end?: number;
	institution?: string;
	current?: boolean;
	role?: string;
};
