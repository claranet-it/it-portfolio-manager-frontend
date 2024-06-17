import { Month } from './month';

export type EffortMatrix = Record<string, Effort>[];

export type Effort = {
	company: string;
	crew?: string;
	name?: string;
	skill?: string;
	effort: Month[];
};
