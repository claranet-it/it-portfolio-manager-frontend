import { Customer } from '@models/customer';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { describe, expect, it } from 'vitest';
import {
	convertTimeToDecimal,
	getFormattedHours,
	getTotalHours,
	getTotalHoursPerRows,
	getlHoursPerProject,
} from '../utils/timesheet';

describe('Hours Timesheet', () => {
	it('Should get hours per project', async () => {
		const timeEntriesMock = [
			{
				date: '',
				company: '',
				customer: '' as Customer,
				project: { name: '', type: 'billable' } as Project,
				task: '' as Task,
				hours: 0,
			},
			{
				date: '',
				company: '',
				customer: '' as Customer,
				project: { name: '', type: 'billable' } as Project,
				task: '' as Task,
				hours: 6,
			},
		];

		const hours = getlHoursPerProject(timeEntriesMock);
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

	it('Should string formatted in greater than 24', async () => {
		const hours = getFormattedHours(35);
		expect(hours).equals('35:00');
	});

	it('Should string formatted with minutes', async () => {
		const hours = getFormattedHours(5.5);
		expect(hours).equals('05:30');
	});

	it('Should get hours per rows', async () => {
		const hoursPerRowsMock = [
			getTotalHours([0, 2, 0]), // 2
			getTotalHours([3, 2, 0]), // 5
			getTotalHours([0, 2, 0]), // 2
			getTotalHours([8, 0, 0]), // 8
			getTotalHours([0, 2, 0]), // 2
			getTotalHours([1, 2, 5]), // 8
			getTotalHours([0, 2, 6]), // 8
			//# 35
		];

		const hours = getTotalHoursPerRows(hoursPerRowsMock);
		expect(hours).equals(35);
	});

	it('Should convert time string to decimal', async () => {
		const timeDecimal = convertTimeToDecimal('05:30');
		expect(timeDecimal).equals(5.5);
	});
});
