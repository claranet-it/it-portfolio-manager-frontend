export type Project = {
	name: string;
	type: ProjectType;
	plannedHours: number;
};

export const projectTypeList = ['billable', 'non-billable', 'slack-time', 'absence', ''] as const;

export type ProjectType = (typeof projectTypeList)[number];
