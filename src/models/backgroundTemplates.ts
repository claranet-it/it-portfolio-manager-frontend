export interface BackgroundTemplate {
	key: string;
	name: string;
}

export type BackgroundTemplatesList = Record<string, BackgroundTemplate[]>;
