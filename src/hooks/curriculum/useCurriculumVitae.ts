import { $, useContext, useSignal } from '@builder.io/qwik';
import { CurriculumGetResponse } from '@models/curriculumVitae';
import { AppContext } from 'src/app';
import { findMatchingRoute } from 'src/router';
import { getCurriculumByEmail } from 'src/services/curriculum';
import { validateEmail } from 'src/utils/email';
import { useNotification } from '../useNotification';

export const useCurriculumVitae = () => {
	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const curriculumVitae = useSignal<CurriculumGetResponse>({} as CurriculumGetResponse);

	const initCurriculumVitae = $(async () => {
		appStore.isLoading = true;
		const match = findMatchingRoute();
		if (!match) return;
		const email = match[1].email ?? null;
		if (!email || !validateEmail(email)) return;

		try {
			curriculumVitae.value = await getCurriculumByEmail(email);
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
		initCurriculumVitae,
		curriculumVitae,
	};
};
