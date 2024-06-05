import { describe, expect, it } from 'vitest';
import {
	getFormattedHours,
	getTotalHours,
	getTotalHoursPerRows,
	getlHoursPerProject,
} from '../utils/timesheet';

describe('Hours Timesheet', () => {
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
		const hours = getTotalHours([0, 2, 0]);
		expect(hours).equals(2);
	});

	it('Should return 0 if array is empty', async () => {
		const hours = getTotalHours([]);
		expect(hours).equals(0);
	});

	it('Should string formatted in hours', async () => {
		const hours = getFormattedHours(4);
		expect(hours).equals('04:00');
	});

	it('Should string formatted in greather than 24', async () => {
		const hours = getFormattedHours(35);
		expect(hours).equals('35:00');
	});

	it('Should string formatted with comma', async () => {
		const hours = getFormattedHours(35.5);
		expect(hours).equals('35:50');
	});

	it('Should get hours per rows', async () => {
		const hoursPerRowsMock = [
			getTotalHours([0, 2, 0]), //2
			getTotalHours([3, 2, 0]), //5
			getTotalHours([0, 2, 0]), //2
			getTotalHours([8, 0, 0]), //8
			getTotalHours([0, 2, 0]), //2
			getTotalHours([1, 2, 5]), //8
			getTotalHours([0, 2, 6]), // 8
			//# 35
		];

		const hours = getTotalHoursPerRows(hoursPerRowsMock);
		expect(hours).equals(35);
	});
});
