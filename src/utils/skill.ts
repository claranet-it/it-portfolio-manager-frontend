import { sync$ } from '@builder.io/qwik';
import { ItemSkill, companySkill, personalSkill } from '@models/skill';
import { getIcon } from 'src/components/icons';

export const getSkillScore = (item: ItemSkill, skill: string) => {
	return item.isCompany
		? (item.skills[skill] as companySkill).averageScore
		: (item.skills[skill] as personalSkill);
};

export const skillComparator = (
	s1: Record<string, ItemSkill>,
	s2: Record<string, ItemSkill>,
	skill: string
) => {
	const s1Score = getSkillScore(Object.values(s1)[0], skill);
	const s2Score = getSkillScore(Object.values(s2)[0], skill);

	return s1Score < s2Score ? 1 : -1;
};

export const getSkillIcon = sync$((serviceLine: string, skill: string) => {
	if (serviceLine.toLowerCase() === 'design') {
		return getIcon('Design');
	}

	if (serviceLine.toLowerCase() === 'softskill') {
		return getIcon('UserGroup');
	}

	return getIcon(skill);
});
