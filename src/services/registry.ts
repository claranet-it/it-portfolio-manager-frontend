import { RegistryHandler } from 'src/utils/registry';

const getTemp = () => {
	return new Promise<boolean>((resolve) => setTimeout(resolve, 500, true));
};

// TODO: Activate routing when available
export const editRegistry = async (props: RegistryHandler, newValue: string): Promise<boolean> => {
	console.log('Edit', newValue);
	if (props.type === 'task') {
		return getTemp();

		// return getHttpResponse<boolean>('task/task', 'PUT', {
		// 	customer: props.customer,
		// 	project: props.project,
		// 	task: props.task,
		// 	newTask: newValue,
		// });
	} else if (props.type === 'project') {
		return getTemp();
		// return getHttpResponse<boolean>('task/customer-project', 'PUT', {
		// 	customer: props.customer,
		// 	project: props.project,
		// 	newProject: newValue,
		// });
	} else {
		return getTemp();
		// return getHttpResponse<boolean>('task/customer-project', 'PUT', {
		// 	customer: props.customer,
		// 	newCustomer: newValue,
		// });
	}
};

export const deleteRegistry = async (props: RegistryHandler): Promise<boolean> => {
	if (props.type === 'task') {
		return getTemp();
	} else if (props.type === 'project') {
		return getTemp();
		// return getHttpResponse<boolean>('task/task', 'DELETE', {
		// 	customer: props.customer,
		// 	project: props.project,
		// 	inactive: true,
		// });
	} else {
		return getTemp();
	}
};
