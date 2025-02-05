import { $, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { NetworkCompany } from '@models/networking';
import { AppContext } from 'src/app';
import {
	getAvailableConnections,
	getExistingConnections,
	removeCompaniesConnection,
	setCompaniesConnection,
} from 'src/services/networking';
import { generateIcon } from 'src/utils/image';
import { useNotification } from './useNotification';

export type NetworkConnections = {
	existing: NetworkCompany[];
	available: NetworkCompany[];
};

export const useNetworking = () => {
	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const connections = useSignal<NetworkConnections>({ existing: [], available: [] });
	const companies = useSignal<NetworkCompany[]>([]);

	const fetchConnections = $(async () => {
		appStore.isLoading = true;
		try {
			const existing = (await getExistingConnections()).map((company) => ({
				...company,
				image_url:
					company.image_url && company.image_url !== ''
						? company.image_url
						: generateIcon(company.domain),
			}));
			const available = (await getAvailableConnections()).map((company) => ({
				...company,
				image_url:
					company.image_url && company.image_url !== ''
						? company.image_url
						: generateIcon(company.domain),
			}));

			connections.value = { existing, available };
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}
		appStore.isLoading = false;
	});

	const fetchAllCompanies = $(async () => {
		appStore.isLoading = true;
		try {
			companies.value = await getExistingConnections();
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}
	});

	const setCompanyConnections = $(async (requesterId: string, correspondentId: string) => {
		appStore.isLoading = true;
		try {
			await setCompaniesConnection(requesterId, correspondentId);
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}
		appStore.isLoading = false;
	});

	const removeCompanyConnections = $(async (requesterId: string, correspondentId: string) => {
		appStore.isLoading = true;
		try {
			await removeCompaniesConnection(requesterId, correspondentId);
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}
		appStore.isLoading = false;
	});

	useVisibleTask$(async () => {
		await fetchConnections();
	});

	return {
		connections,
		companies,
		fetchAllCompanies,
		setCompanyConnections,
		removeCompanyConnections,
	};
};
