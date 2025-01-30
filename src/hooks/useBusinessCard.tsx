import { $, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { BusinessCardData } from '@models/businessCard';
import { UserMe } from '@models/user';
import { AppContext } from 'src/app';
import {
	deleteMyBusinessCardData,
	getMyBusinessCardData,
	saveMyBusinessCardData,
} from 'src/services/businessCard';
import { AUTH_USER_KEY } from 'src/utils/constants';
import { get } from 'src/utils/localStorage/localStorage';

export const useBusinessCard = () => {
	const appStore = useContext(AppContext);

	const businessCard = useSignal<BusinessCardData>({} as BusinessCardData);
	const initialBusinessCard = useSignal<BusinessCardData>({} as BusinessCardData);
	const isBusinessCardPresent = useSignal<boolean>(false);

	const isBusinessCardModified = useComputed$(
		() => JSON.stringify(businessCard.value) !== JSON.stringify(initialBusinessCard.value)
	);

	const initBusinessCardFromStorage = $(async () => {
		const user = JSON.parse((await get(AUTH_USER_KEY)) || '{}') as UserMe;
		const businessCardData = {
			name: user.name,
			email: user.email,
		};
		businessCard.value = { ...businessCardData };
		initialBusinessCard.value = { ...businessCardData };
	});

	const fetchBusinessCard = $(async () => {
		appStore.isLoading = true;
		const businessCardData = await getMyBusinessCardData();
		appStore.isLoading = false;
		if (Object.keys(businessCardData).length) {
			isBusinessCardPresent.value = true;
			businessCard.value = { ...businessCardData };
			initialBusinessCard.value = { ...businessCardData };
		} else {
			initBusinessCardFromStorage();
		}
	});

	const deleteBusinessCard = $(async () => {
		appStore.isLoading = true;
		await deleteMyBusinessCardData();
		appStore.isLoading = false;
		isBusinessCardPresent.value = false;
		initBusinessCardFromStorage();
	});

	const saveBusinessCard = $(async () => {
		appStore.isLoading = true;
		await saveMyBusinessCardData(businessCard.value);
		initialBusinessCard.value = { ...businessCard.value };
		appStore.isLoading = false;
		isBusinessCardPresent.value = true;
	});

	return {
		businessCard,
		isBusinessCardPresent,
		isBusinessCardModified,
		fetchBusinessCard,
		deleteBusinessCard,
		saveBusinessCard,
	};
};
