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
		if (!Object.keys(appStore.configuration.skills).length) {
			const configuration = await getConfiguration();
			appStore.configuration = configuration;
		}

		effortSig.value = await getEffort();
	});

	const updateEffortField = $(
		async (
			userKey: number,
			effortKey: number,
			uid: string,
			month: Month,
			data: Omit<Effort, 'effort' | 'skill'>
		) => {
			let result = false;

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

			// In case of a successful update,
			// the effort signal is updated with the new values and load from
			// BE accurate values from the backend
			if (result) {
				effortSig.value[userKey][uid].effort[effortKey].confirmedEffort =
					month.confirmedEffort;
				effortSig.value[userKey][uid].effort[effortKey].tentativeEffort =
					month.tentativeEffort;
				effortSig.value[userKey][uid].effort[effortKey].notes = month.notes;

				await loadEffort();
			}

			return Promise.resolve(result);
		}
	);

	return { monthYearListSig, loadEffort, effortSig, updateEffortField };
};
