import { $, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { Effort, EffortMatrix } from '@models/effort';
import { Month } from '@models/month';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
import { getConfiguration } from 'src/services/configuration';
import { getEffort, putEffort } from 'src/services/effort';
import { useNotification } from './useNotification';

export const useEffort = () => {
	const appStore = useContext(AppContext);
	const effortSig = useSignal<EffortMatrix>([]);
	const { addEvent } = useNotification();

	const monthYearListSig = useComputed$<string[]>(() => {
		if (effortSig.value.length > 0) {
			const [{ effort }] = Object.values(effortSig.value[0]);
			return effort.map(({ month_year }) => month_year);
		}
		return [];
	});

	const loadEffort = $(async () => {
		appStore.isLoading = true;

		if (!Object.keys(appStore.configuration.skills).length) {
			const configuration = await getConfiguration();
			appStore.configuration = configuration;
		}

		effortSig.value = await getEffort();
		appStore.isLoading = false;
	});

	const updateEffortField = $(
		async (uid: string, month: Month, data: Omit<Effort, 'effort' | 'skill'>) => {
			let result = false;
			appStore.isLoading = true;

			try {
				await putEffort(uid, data, month);
				addEvent({
					message: t('EFFORT_SUCCESSFULLY_UPDATED'),
					type: 'success',
					autoclose: true,
				});
				result = true;
			} catch (error) {
				const { message } = error as Error;
				addEvent({
					message: message,
					type: 'danger',
				});
				result = false;
			}

			if (result) {
				await loadEffort();
			}
			appStore.isLoading = false;

			return Promise.resolve(result);
		}
	);

	return { monthYearListSig, loadEffort, effortSig, updateEffortField };
};
