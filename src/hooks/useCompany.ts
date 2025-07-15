import { $, useContext, useSignal } from '@builder.io/qwik';
import { Company } from '@models/company';
import { UserProfile } from '@models/user';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
import { editCompanyMineImage, editSkillVisibility, getCompanyMine } from 'src/services/company';
import { getUserProfiles } from 'src/services/user';
import { INIT_COMPANY_VALUE } from 'src/utils/constants';
import { useNotification } from './useNotification';

export const useCompany = () => {
	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const company = useSignal<Company>(INIT_COMPANY_VALUE);

	const userSig = useSignal<UserProfile[]>([]);

	const fetchCompany = $(async () => {
		appStore.isLoading = true;
		try {
			company.value = await getCompanyMine();
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

	const fetchUsers = $(async () => {
		appStore.isLoading = true;
		userSig.value = (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
		appStore.isLoading = false;
	});

	const updateCompanyLogo = $(async (image_url: string) => {
		appStore.isLoading = true;
		let response;

		try {
			response = await editCompanyMineImage(company.value.id, image_url);
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}

		await fetchCompany();
		appStore.isLoading = false;

		return response;
	});

	const updateSkillVisibility = $(async (id: number, visible: boolean) => {
		appStore.isLoading = true;
		let response;
		try {
			response = await editSkillVisibility(id, visible);
			addEvent({
				message: t('SKILL_VISIBILITY_SUCCESSFULLY_UPDATED'),
				type: 'success',
				autoclose: true,
			});
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}

		await fetchCompany();
		appStore.isLoading = false;

		return response;
	});

	return {
		company,
		fetchCompany,
		updateCompanyLogo,
		updateSkillVisibility,
	};
};
