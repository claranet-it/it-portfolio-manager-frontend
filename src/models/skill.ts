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

export type SkillMatrix = Record<
	string,
	{
		company: string;
		crew?: string;
		skills: Record<string, personalSkill | companySkill>;
	}
>[];
