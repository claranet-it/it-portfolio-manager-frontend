import { $, useSignal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { getCustomers } from 'src/services/customer';

export const useCustomers = () => {
	const isLoading = useSignal<Boolean>(false);
	const customers = useSignal<Customer[]>([]);

	const fetchCustomers = $(async () => {
		customers.value = [];
		isLoading.value = true;
		customers.value = await getCustomers();
		isLoading.value = false;
	});

	return { customers, isLoading, fetchCustomers };
};
