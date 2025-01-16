export type Skill = {
	skill: SkillData;
	score: number;
	skillCategory: string;
};

export type SkillData = {
	name: string;
	description: string;
};

export type UserSkill = {
	uid: string;
	company: string;
	crew: string;
	name: string;
	skill: string;
	skillCategory: string;
	score: number;
	updatedAt: string;
};

export type personalSkill = number;

export type companySkill = {
	people: number;
	averageScore: number;
};

export type ItemSkill = {
	company: string;
	isCompany: boolean;
	crew: string;
	skills: Record<string, personalSkill | companySkill>;
};

export type SkillMatrix = Record<string, ItemSkill>[];
