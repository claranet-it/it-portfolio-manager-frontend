import { $, useContext, useSignal } from '@builder.io/qwik';
import { Company } from '@models/company';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
import { editCompanyMineImage, editSkillVisibility, getCompanyMine } from 'src/services/company';
import { activateUser, deactivateUser, editUserProfile } from 'src/services/user';
import { INIT_COMPANY_VALUE } from 'src/utils/constants';
import { useNotification } from './useNotification';

export const useCompany = () => {
	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const company = useSignal<Company>(INIT_COMPANY_VALUE);

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

	const updateUser = $(async (userId: string, role: string, crew: string) => {
		appStore.isLoading = true;

		try {
			await editUserProfile(userId, crew, role);
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

	const updateUserActivation = $(async (userId: string, active: boolean) => {
		appStore.isLoading = true;

		try {
			if (active) {
				await activateUser(userId);
			} else {
				await deactivateUser(userId);
			}
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

	return {
		company,
		fetchCompany,
		updateCompanyLogo,
		user: {
			updateUser,
			updateUserActivation,
		},
		updateSkillVisibility,
	};
};
