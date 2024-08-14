import { $, Signal, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { ReportTimeEntry, RepotTab } from '@models/report';
import { AppContext } from 'src/app';
import { getReportTimeEntry } from 'src/services/report';
import { formatDateString } from 'src/utils/dates';

export const useReportProject = (from: Signal, to: Signal, tab: Signal<RepotTab>) => {
	const appStore = useContext(AppContext);
	const results = useStore<{ data: ReportTimeEntry[] }>({ data: [] });

	const featchProjets = $(async () => {
		appStore.isLoading = true;

		results.data = await getReportTimeEntry(
			formatDateString(from.value),
			formatDateString(to.value)
		);
		appStore.isLoading = false;
	});

	useTask$(({ track }) => {
		track(() => from.value);
		track(() => to.value);
		track(() => tab.value);
		tab.value === 'project' && featchProjets();
	});

	return { results };
};
