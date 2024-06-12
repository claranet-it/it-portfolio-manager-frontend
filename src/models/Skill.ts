export type Skill = {
	skill: string;
	score: number;
	skillCategory: string;
};

export type SkillMatrix = Record<
	string,
	{
		company: string;
		crew: string;
		skills: Record<string, number>;
	}
>[];
