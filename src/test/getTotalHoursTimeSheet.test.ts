import { describe, expect, it } from 'vitest';
import {
	getFormattedHours,
	getTotalHoursPerDay,
	getlHoursPerProject,
} from '../components/TimeSheetTable';

describe('Total Hours Timesheet', () => {
	it('Should get hours per project', async () => {
		const timeEnriesMock = [
			{
				date: '',
				company: '',
				customer: '',
				project: '',
				task: '',
				hours: 0,
			},
			{
				date: '',
				company: '',
				customer: '',
				project: '',
				task: '',
				hours: 6,
			},
		];

		const hours = getlHoursPerProject(timeEnriesMock);
		expect(hours).to.eql([0, 6]);
	});

	it('Should get total hours per day', async () => {
		const hours = getTotalHoursPerDay([0, 2, 0]);
		expect(hours).equals(2);
	});

	it('Should return 0 if array is empty', async () => {
		const hours = getTotalHoursPerDay([]);
		expect(hours).equals(0);
	});

	it('Should string formatted in hours', async () => {
		const hours = getFormattedHours(4);
		expect(hours).equals('04:00');
	});
});
