type AboutMeData = {
	name: string;
	email: string;
	role: string;
	summary?: string;
	main_skills?: string;
};

type Experience = {
	note?: string;
	year_start: number;
	year_end?: number;
	institution: string;
	current?: boolean;
};

type ExperienceUpdate = {
	note?: string;
	year_start?: number;
	year_end?: number;
	institution?: string;
	current?: boolean;
};

export type EducationGetResponse = Experience & {
	id: string;
};

export type WorkGetResponse = Experience & {
	role?: string;
	id: string;
};

export type CurriculumGetResponse = AboutMeData & {
	education?: EducationGetResponse[];
	work?: WorkGetResponse[];
};

export type EducationSaveData = Experience;

export type WorkSaveData = Experience & {
	role?: string;
};

export type CurriculumSaveData = AboutMeData & {
	education?: EducationSaveData[];
	work?: WorkSaveData[];
};

export type CurriculumUpdateData = {
	role?: string;
	summary?: string;
	main_skills?: string;
};

export type EducationUpdateData = ExperienceUpdate;

export type WorkUpdateData = ExperienceUpdate & {
	role?: string;
};
