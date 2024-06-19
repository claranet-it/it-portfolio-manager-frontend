export type Skill = {
	skill: string;
	score: number;
	skillCategory: string;
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
