import { Month } from './Month';

export type EffortMatrix = Record<string, Effort>[];

export type Effort = {
	company: string;
	crew: string;
	name: string;
	effort: Month[];
};
