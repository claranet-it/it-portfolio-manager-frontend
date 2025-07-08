import { Customer } from '@models/customer';
import { Effort } from '@models/effort';
import { Month } from '@models/month';
import { Project } from '@models/project';
import { Task } from '@models/task';
import { TimeEntry, TimeEntryObject } from '@models/timeEntry';
import { getCipher } from './cipher';

export async function encryptString(str: string): Promise<string>;
export async function encryptString(str: undefined): Promise<undefined>;
export async function encryptString(str?: string): Promise<string | undefined>;
export async function encryptString(str?: string): Promise<string | undefined> {
	if (str === undefined) {
		return undefined;
	}
	const cipher = getCipher();
	const strEncrypted = await cipher.encrypt(str);
	return strEncrypted;
}

export async function decryptString(str: string): Promise<string>;
export async function decryptString(str: undefined): Promise<undefined>;
export async function decryptString(str?: string): Promise<string | undefined>;
export async function decryptString(str?: string): Promise<string | undefined> {
	const cipher = getCipher();
	const strDecrypted = await cipher.decrypt(str);
	return strDecrypted;
}

export const encryptCustomer = async (customer: Customer): Promise<Customer> => {
	const cipher = getCipher();
	const customerNameEncrypted = await cipher.encrypt(customer.name);
	return {
		...customer,
		name: customerNameEncrypted,
	};
};

export const decryptCustomer = async (customer: Customer): Promise<Customer> => {
	const cipher = getCipher();
	const customerNameDecrypted = await cipher.decrypt(customer.name);
	return {
		...customer,
		name: customerNameDecrypted,
	};
};

export const encryptProject = async (project: Project): Promise<Project> => {
	const cipher = getCipher();
	const projectNameEncrypted = await cipher.encrypt(project.name);
	return {
		...project,
		name: projectNameEncrypted,
	};
};

export const decryptProject = async (project: Project): Promise<Project> => {
	const cipher = getCipher();
	const projectNameDecrypted = await cipher.decrypt(project.name);
	return {
		...project,
		name: projectNameDecrypted,
	};
};

export const encryptTask = async (task: Task): Promise<Task> => {
	const cipher = getCipher();
	const taskNameEncrypted = await cipher.encrypt(task.name);
	return {
		...task,
		name: taskNameEncrypted,
	};
};

export const decryptTask = async (task: Task): Promise<Task> => {
	const cipher = getCipher();
	const taskNameDecrypted = await cipher.decrypt(task.name);
	return {
		...task,
		name: taskNameDecrypted,
	};
};

export const encryptTimeEntry = async <T extends TimeEntry | TimeEntryObject>(
	timeEntry: T
): Promise<T> => {
	return {
		...timeEntry,
		description: await encryptString(timeEntry.description),
	};
};

export const decryptTimeEntry = async <T extends TimeEntry | TimeEntryObject>(
	timeEntry: T
): Promise<T> => {
	return {
		...timeEntry,
		customer: await decryptCustomer(timeEntry.customer),
		project: await decryptProject(timeEntry.project),
		task: await decryptTask(timeEntry.task),
		description: await decryptString(timeEntry.description),
	};
};

export const encryptMonthNote = async (month: Month): Promise<Month> => {
	return {
		...month,
		notes: await encryptString(month.notes),
	};
};

export const decryptMonthNote = async (month: Month): Promise<Month> => {
	return {
		...month,
		notes: await decryptString(month.notes),
	};
};

export const decryptEffortNotes = async (month: Effort): Promise<Effort> => {
	const { effort, ...rest } = month;
	return {
		...rest,
		effort: await Promise.all(effort.map(decryptMonthNote)),
	};
};
