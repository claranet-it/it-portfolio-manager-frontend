export type Project = {
	name: string;
	type: ProjectType;
};

export type ProjectType = 'billable' | 'non-billable' | 'slack-time' | 'absence' | '';
