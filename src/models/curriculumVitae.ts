export type CurriculumGetResponse = {
	name: string;
	email: string;
	role: string;
	summary?: string;
	main_skills?: string;
	education?: EducationGetResponse[];
	work?: WorkGetResponse[];
};

export type EducationGetResponse = {
	note?: string;
	year_start: number;
	year_end?: number;
	institution: string;
	current?: boolean;
	id: string;
};

export type WorkGetResponse = EducationGetResponse & {
	role?: string;
};

export type CurriculumSaveData = {
	name: string;
	email: string;
	role: string;
	summary?: string;
	main_skills?: string;
	education?: EducationSaveData[];
	work?: WorkSaveData[];
};

export type EducationSaveData = {
	note?: string;
	year_start: number;
	year_end?: number;
	institution: string;
	current?: boolean;
};

export type WorkSaveData = {
	note?: string;
	year_start: number;
	year_end?: number;
	institution: string;
	current?: boolean;
	role?: string;
};

export type CurriculumUpdateData = {
	role?: string;
	summary?: string;
	main_skills?: string;
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
